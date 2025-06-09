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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";

const MotionBox = motion(Box);

const faceStyles = {
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "20px",
  padding: "28px 32px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxSizing: "border-box",
  backfaceVisibility: "hidden",
};

export default function App() {
  const [data, setData] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const audioRef = useRef(null);

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

  if (!data) {
    return (
      <Text mt={20} textAlign="center" color="white">
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
      >
        <Box w="100vw" maxW="500px" px={4} sx={{ perspective: "1200px" }}>
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
              boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
              background: "linear-gradient(to right bottom, #4c57a9, #6a73d6)",
            }}
          >
            {/* Front */}
            <Box
              sx={faceStyles}
              bg="rgba(255, 255, 255, 0.18)"
              boxShadow="inset 0 0 40px rgba(255,255,255,0.25)"
              transform="rotateY(0deg)"
            >
              <Heading as="h1" size="xl" mb={3}>
                {data.name}
              </Heading>
              <Heading as="h3" size="md" mb={1} fontWeight="600" color="#c0c7ff">
                {data.title}
              </Heading>
              <Text fontSize="md" fontWeight="400" color="#aab2ff">
                {data.company}
              </Text>
            </Box>

            {/* Back */}
            <Box
              sx={faceStyles}
              bg="rgba(255, 255, 255, 0.15)"
              boxShadow="inset 0 0 40px rgba(0,0,0,0.35)"
              transform="rotateY(180deg)"
              color="#eaeaff"
              fontSize="16px"
              display="flex"
              justifyContent="space-between"
              flexDirection="column"
              overflowWrap="break-word"
            >
              <Box display="flex" flexDirection="column" gap={4}>
                <CopyButton label="複製電話" text={data.phone} icon="📞" />
                <CopyButton label="複製 Email" text={data.email} icon="📧" />

                <Flex justify="center" gap={5}>
                  <CustomLink href={data.linkedin} label="LinkedIn" />
                  <CustomLink href={data.github} label="GitHub" />
                </Flex>
              </Box>

              <Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
                <QRCode value={data.website} size={160} />
                <Text fontSize="sm" color="#b0b6ffcc">
                  掃描訪問我的網站
                </Text>
              </Box>
            </Box>
          </MotionBox>
        </Box>
        <audio ref={audioRef} src="/flip-sound.mp3" preload="auto" />
      </Flex>
    </ChakraProvider>
  );
}

function CopyButton({ label, text, icon }) {
  const { hasCopied, onCopy } = useClipboard(text);

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onCopy();
        alert(`已複製：${text}`);
      }}
      bg="#5667c9"
      _hover={{ bg: "#4559b3" }}
      _active={{ bg: "#3f4f9c" }}
      borderRadius="10px"
      fontSize="18px"
      fontWeight="700"
      textAlign="left"
      p="14px 20px"
      whiteSpace="normal"
      wordBreak="break-word"
    >
      <Box as="span" mr={2}>
        {icon}
      </Box>
      {text}
      <VisuallyHidden>{hasCopied ? "已複製" : "未複製"}</VisuallyHidden>
    </Button>
  );
}

function CustomLink({ href, label }) {
  return (
    <Link
      href={href}
      isExternal
      px={4}
      py={2}
      borderRadius="16px"
      fontWeight="700"
      color="#9faeff"
      bg="rgba(255,255,255,0.2)"
      _hover={{ bg: "rgba(255,255,255,0.35)" }}
      boxShadow="0 3px 8px rgba(255,255,255,0.2)"
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </Link>
  );
}
