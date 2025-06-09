import React, { useState, useEffect, useRef } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Flex,
  Link,
  Text,
  Heading,
  useClipboard,
  VisuallyHidden,
  Tooltip,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";

const MotionBox = motion(Box);

const faceStyles = {
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "20px",
  padding: "32px 36px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxSizing: "border-box",
  backfaceVisibility: "hidden",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
};

export default function App() {
  const [data, setData] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const audioRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL || "/"}data.json`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => alert("讀取資料失敗"));
  }, []);

  const handleFlip = () => {
    setFlipped(!flipped);
    if (audioRef.current) audioRef.current.play();
    if (navigator.vibrate) navigator.vibrate(100);
  };

const handleDownloadBothSides = async () => {
  if (!cardRef.current) return;

  const frontEl = cardRef.current.querySelector(".front");
  const backEl = cardRef.current.querySelector(".back");
  if (!frontEl || !backEl) {
    alert("找不到正面或背面元素");
    return;
  }

  try {
    // 正面截圖
    const frontDataUrl = await htmlToImage.toPng(frontEl, {
      backgroundColor: null,
      quality: 1,
      pixelRatio: 2,
    });

    // 背面截圖前移除旋轉
    const originalTransform = backEl.style.transform;
    backEl.style.transform = "none";

    const backDataUrl = await htmlToImage.toPng(backEl, {
      backgroundColor: null,
      quality: 1,
      pixelRatio: 2,
    });

    backEl.style.transform = originalTransform;

    const frontImg = new Image();
    const backImg = new Image();

    await Promise.all([
      new Promise((res) => {
        frontImg.onload = res;
        frontImg.src = frontDataUrl;
      }),
      new Promise((res) => {
        backImg.onload = res;
        backImg.src = backDataUrl;
      }),
    ]);

    // 合成上下排列
    const canvas = document.createElement("canvas");
    const width = Math.max(frontImg.width, backImg.width);
    const height = frontImg.height + backImg.height;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("無法取得 Canvas 2D context");

    ctx.fillStyle = "#f9f9fb"; // 淺灰背景，比純白更柔和
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(frontImg, 0, 0);
    // 這裡改成直接畫 backImg，移除水平翻轉
    ctx.drawImage(backImg, 0, frontImg.height);

    const combinedDataUrl = canvas.toDataURL("image/png");
    download(combinedDataUrl, "resume-card-both-sides.png");
  } catch (error) {
    alert("下載圖片失敗：" + error);
  }
};


  const handleGenerateShortUrl = async () => {
    const longUrl = window.location.href;
    try {
      const res = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
      );
      const url = await res.text();
      setShortUrl(url);
    } catch {
      alert("產生短網址失敗！");
    }
  };

  if (!data) {
    return (
      <Text mt={20} textAlign="center" color="white" fontSize="xl">
        載入中...
      </Text>
    );
  }

  return (
    <ChakraProvider>
      <Flex
        height="100vh"
        bgGradient="linear(to-tr, #667eea, #764ba2)"
        fontFamily="'Noto Sans TC', sans-serif"
        color="white"
        align="center"
        justify="center"
        userSelect="none"
        sx={{ WebkitTapHighlightColor: "transparent" }}
        flexDirection="column"
        px={4}
      >
        <Box w="100%" maxW="500px" sx={{ perspective: "1200px" }} ref={cardRef}>
          <MotionBox
            onClick={handleFlip}
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleFlip();
            }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.7 }}
            style={{
              width: "100%",
              height: "400px",
              position: "relative",
              transformStyle: "preserve-3d",
              cursor: "pointer",
              borderRadius: "20px",
              boxShadow:
                "0 24px 48px rgba(0,0,0,0.4), 0 0 15px rgba(102, 126, 234, 0.5)",
              background: "linear-gradient(135deg, #4c57a9, #6a73d6)",
            }}
          >
            {/* 正面 */}
            <Box
              className="front"
              sx={faceStyles}
              bg="rgba(255, 255, 255, 0.22)"
              boxShadow="inset 0 0 40px rgba(255,255,255,0.3)"
              transform="rotateY(0deg)"
              color="#1e1e2f"
            >
              <Heading as="h1" size="2xl" mb={3} fontWeight="bold" letterSpacing="wide" color="#2a2a70">
                {data.name}
              </Heading>
              <Heading
                as="h3"
                size="md"
                mb={2}
                fontWeight="600"
                color="#5f7cff"
                letterSpacing="wider"
                textTransform="uppercase"
              >
                {data.title}
              </Heading>
              <Text fontSize="lg" fontWeight="500" color="#4a50ff" letterSpacing="wide">
                {data.company}
              </Text> 

            </Box>

            {/* 背面 */}
            <Box
              className="back"
              sx={faceStyles}
              bg="rgba(30, 30, 47, 0.85)"
              boxShadow="inset 0 0 50px rgba(0,0,0,0.45)"
              transform="rotateY(180deg)"
              color="#d6d6ff"
              fontSize="16px"
              display="flex"
              justifyContent="space-between"
              flexDirection="column"
              overflowWrap="break-word"
              letterSpacing="0.03em"
            >
              <Box display="flex" flexDirection="column" gap={4}>
                <CopyButton label="電話" text={data.phone} icon="📞" />
                <CopyButton label="Email" text={data.email} icon="📧" />

                <Flex justify="center" gap={6} mt={2}>
                  <CustomLink href={data.linkedin} label="LinkedIn" />
                  <CustomLink href={data.github} label="GitHub" />
                </Flex>
              </Box>

              <Box mt={4} display="flex" flexDirection="column" alignItems="center" gap={3}>
                <Box
                  p={3}
                  bg="rgba(255,255,255,0.1)"
                  borderRadius="md"
                  boxShadow="0 0 15px rgba(102, 126, 234, 0.6)"
                >
                  <QRCode value={data.website} size={160} bgColor="transparent" fgColor="#aabbff" />
                </Box>
                <Text fontSize="sm" color="#b0b6ffcc" letterSpacing="wide">
                  掃描訪問我的網站
                </Text>
              </Box>
            </Box>
          </MotionBox>
        </Box>

        {/* 分享區域 */}
        <Flex mt={8} flexDirection="column" align="center" gap={4} w="100%" maxW="400px">
          <Button colorScheme="teal" size="lg" onClick={handleDownloadBothSides} w="100%">
            下載履歷卡（兩面）
          </Button>
          <Button colorScheme="blue" size="lg" onClick={handleGenerateShortUrl} w="100%">
            產生短網址
          </Button>
          {shortUrl && (
            <Text fontSize="sm" textAlign="center" mt={2} wordBreak="break-all" color="#e3e3ff">
              短網址：
              <Link href={shortUrl} isExternal color="yellow.300" fontWeight="bold">
                {shortUrl}
              </Link>
            </Text>
          )}
        </Flex>

        <audio ref={audioRef} src={`${import.meta.env.BASE_URL}flip-sound.mp3`} preload="auto" />
      </Flex>
    </ChakraProvider>
  );
}

function CopyButton({ label, text, icon }) {
  const { hasCopied, onCopy } = useClipboard(text);

  return (
    <Tooltip label={hasCopied ? "已複製" : `複製${label}`} closeOnClick={false} hasArrow>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onCopy();
        }}
        size="md"
        variant="ghost"
        colorScheme={hasCopied ? "green" : "whiteAlpha"}
        fontWeight="semibold"
        fontSize="md"
        leftIcon={<span style={{ fontSize: "20px" }}>{icon}</span>}
        _focus={{ boxShadow: "outline" }}
      >
        {text}
        <VisuallyHidden>複製{label}</VisuallyHidden>
      </Button>
    </Tooltip>
  );
}

function CustomLink({ href, label }) {
  return (
    <Link
      href={href}
      isExternal
      fontWeight="bold"
      fontSize="md"
      color="#a3aaff"
      _hover={{ color: "#d6d6ff" }}
      _focus={{ boxShadow: "outline" }}
      px={2}
      py={1}
      borderRadius="md"
    >
      {label}
    </Link>
  );
}
