import React, { useState, useEffect, useRef } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Flex,
  Text,
  Heading,
  Switch,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useClipboard,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";

import { CopyButton } from "./components/CopyButton";
import { CustomLink } from "./components/CustomLink";

const MotionBox = motion(Box);
const themes = {
  light: {
    front: {
      bg: "white",
      color: "#2a2a70",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      insetShadow: "inset 0 0 40px rgba(0,0,0,0.05)",
    },
    back: {
      bg: "#f5f5f7",
      color: "#4a50ff", // 調整為較深色
      boxShadow: "inset 0 0 50px rgba(0,0,0,0.08)",
    },
    cardShadow: "0 24px 48px rgba(0,0,0,0.15), 0 0 15px rgba(102, 126, 234, 0.3)",
    qrFg: "#4a50ff",
  },
  dark: {
    front: {
      bg: "rgba(255, 255, 255, 0.22)",
      color: "#2a2a70",
      boxShadow: "inset 0 0 40px rgba(255,255,255,0.3)",
    },
    back: {
      bg: "rgba(30, 30, 47, 0.85)",
      color: "#d6d6ff",
      boxShadow: "inset 0 0 50px rgba(0,0,0,0.45)",
    },
    cardShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 15px rgba(102, 126, 234, 0.5)",
    qrFg: "#aabbff",
  },
};



const faceBaseStyles = {
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
};

export default function App() {
  const [data, setData] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [themeKey, setThemeKey] = useState("dark");
  const audioRef = useRef(null);
  const cardRef = useRef(null);
  const { hasCopied, onCopy } = useClipboard(shortUrl);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL || "/"}data.json`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => alert("讀取資料失敗"));
  }, []);

  const theme = themes[themeKey];

  const handleFlip = (event) => {
  event?.preventDefault();
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

      const canvas = document.createElement("canvas");
      const width = Math.max(frontImg.width, backImg.width);
      const height = frontImg.height + backImg.height;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("無法取得 Canvas 2D context");

      ctx.fillStyle = theme.front.bg || "#f9f9fb";
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(frontImg, 0, 0);
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
        {/* 主題切換下拉選單 */}
      <Switch
        isChecked={themeKey === "dark"}
        onChange={(e) => setThemeKey(e.target.checked ? "dark" : "light")}
        size="lg"
        colorScheme="blue"
        aria-label="切換淺色或深色主題"
      />
      <Text ml={3} display="inline">
        {themeKey === "dark" ? "深色主題" : "淺色主題"}
      </Text>


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
            boxShadow: theme.cardShadow,
            background: theme.front.bg,
          }}
        >
          {/* 正面 */}
          <Box
            className="front"
            sx={{
              ...faceBaseStyles,
              background: theme.front.bg,
              boxShadow: theme.front.boxShadow,
              color: theme.front.color,
            }}
            transform="rotateY(0deg)"
          >
            <Heading
              as="h1"
              size="2xl"
              mb={3}
              fontWeight="bold"
              letterSpacing="wide"
              color={theme.front.color}
            >
              {data.name}
            </Heading>
            <Heading
              as="h3"
              size="md"
              mb={2}
              fontWeight="600"
              letterSpacing="wider"
              textTransform="uppercase"
              color={theme.front.color}
            >
              {data.title}
            </Heading>
            <Text fontWeight="bold" fontSize="sm" color={theme.front.color}>
              {data.company}
            </Text>
            
          </Box>

          {/* 背面 */}
          <Box
          className="back"
          sx={{
            ...faceBaseStyles,
            background: theme.back.bg,
            boxShadow: theme.back.boxShadow,
            color: theme.back.color,
            transform: "rotateY(180deg)",
            padding: 4,
          }}
          >
          <Box display="flex" flexDirection="column" gap={4}>
            <CopyButton 
              label="電話" 
              text={data.phone} 
              icon="📞" 
              color={theme.back.color} 
            />
            <CopyButton 
              label="Email" 
              text={data.email} 
              icon="📧" 
              color={ theme.back.color} 
            /> 

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
              <QRCode
                value={data.website}
                size={160}
                bgColor="transparent"
                fgColor="#aabbff"
              />
            </Box>
            <Text fontSize="sm" color="#b0b6ffcc" letterSpacing="wide">
              掃描訪問我的網站
            </Text>
          </Box>
        </Box>

        </MotionBox>

        {/* 功能按鈕 */}
        <Flex mt={4} gap={4} justify="center" wrap="wrap">
          <Button
            colorScheme="blue"
            onClick={handleDownloadBothSides}
            aria-label="下載名片"
          >
            下載名片
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleGenerateShortUrl}
            aria-label="產生短網址"
          >
            產生短網址
          </Button>
          {shortUrl && (
        <>
          <InputGroup mb={4}>
            <Input value={shortUrl} isReadOnly />
            <InputRightElement width="3rem">
              <IconButton
                aria-label={hasCopied ? "已複製" : "複製短網址"}
                icon={hasCopied ? <CheckIcon /> : <span style={{ fontSize: "18px" }}>📋</span>}
                onClick={onCopy}
                size="sm"
                variant="ghost"
                colorScheme={hasCopied ? "green" : "blue"}
              />
            </InputRightElement>
          </InputGroup>
          <Text mt={2} fontSize="sm" color={theme.front.color}>
            你可以將這個短網址分享給別人
          </Text>
        </>
        )}
        </Flex>

        

      </Box>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}flip-sound.mp3`}
        preload="auto"
      />
      </Flex>
      
    </ChakraProvider>
  );
}




