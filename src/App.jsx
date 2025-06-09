import React, { useState, useEffect } from "react";
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
import ReactQRCode from "react-qr-code";

const flipStyles = {
  perspective: "1200px",
};

const cardStyles = {
  width: "100%",
  maxWidth: "500px",
  height: { base: "280px", md: "350px", lg: "400px" },
  margin: "0 auto",
  position: "relative",
  cursor: "pointer",
  transformStyle: "preserve-3d",
  transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
  borderRadius: "20px",
  bgGradient: "linear(to-br, #4c57a9, #6a73d6)",
  userSelect: "none",
};

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

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setData)
      .catch(() => alert("讀取資料失敗"));
  }, []);

  if (!data)
    return (
      <Text mt={20} textAlign="center" color="white">
        載入中...
      </Text>
    );

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
        <Box sx={flipStyles} w="100vw" maxW="500px" px={4}>
          <Box
            sx={cardStyles}
            onClick={() => setFlipped(!flipped)}
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setFlipped(!flipped);
              }
            }}
            title="點擊翻轉名片"
            transform={flipped ? "rotateY(180deg)" : "none"}
          >
            {/* 正面 */}
            <Box
              sx={faceStyles}
              bg="rgba(255, 255, 255, 0.18)"
              boxShadow="inset 0 0 40px rgba(255,255,255,0.25)"
              color="white"
              fontWeight="700"
              fontSize="28px"
              textAlign="center"
              lineHeight="1.2"
              overflowWrap="break-word"
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

            {/* 背面 */}
            <Box
              sx={faceStyles}
              bg="rgba(255, 255, 255, 0.15)"
              boxShadow="inset 0 0 40px rgba(0,0,0,0.35)"
              transform="rotateY(180deg)"
              color="#eaeaff"
              fontSize="16px"
              justifyContent="space-between"
              gap={4}
              overflowWrap="break-word"
            >
              <Box display="flex" flexDirection="column" gap={4}>
                <CopyButton label={`複製電話 ${data.phone}`} text={data.phone} icon="📞" bg="transparent" />
<CopyButton label={`複製電子郵件 ${data.email}`} text={data.email} icon="📧" bg="transparent" />

                <Flex justify="center" gap={5} fontSize="16px">
                  <Link
                    href={data.linkedin}
                    isExternal
                    bg="rgba(255,255,255,0.2)"
                    px={4}
                    py={2}
                    borderRadius="16px"
                    fontWeight="700"
                    color="#9faeff"
                    _hover={{ bg: "rgba(255,255,255,0.35)" }}
                    onClick={(e) => e.stopPropagation()}
                    userSelect="text"
                    boxShadow="0 3px 8px rgba(255,255,255,0.2)"
                  >
                    LinkedIn
                  </Link>
                  <Link
                    href={data.github}
                    isExternal
                    bg="rgba(255,255,255,0.2)"
                    px={4}
                    py={2}
                    borderRadius="16px"
                    fontWeight="700"
                    color="#9faeff"
                    _hover={{ bg: "rgba(255,255,255,0.35)" }}
                    onClick={(e) => e.stopPropagation()}
                    userSelect="text"
                    boxShadow="0 3px 8px rgba(255,255,255,0.2)"
                  >
                    GitHub
                  </Link>
                </Flex>
              </Box>

              <Box
                mt={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                userSelect="none"
              >
                <ReactQRCode value={data.website} size={160} />
                <Text fontSize="sm" color="#b0b6ffcc" m={0}>
                  掃描訪問我的網站
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

function CopyButton({ label, text, icon, bg }) {
  const { hasCopied, onCopy } = useClipboard(text);

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onCopy();
        alert(`已複製：${text}`);
      }}
      bg={bg ?? "#5667c9"}
      _active={{ bg: bg ? bg : "#3f4f9c" }}
      boxShadow={bg ? "none" : "0 6px 12px rgba(86,103,201,0.5)"}
      borderRadius="10px"
      fontSize="18px"
      fontWeight="700"
      textAlign="left"
      p="14px 20px"
      maxW="100%"
      whiteSpace="normal"
      wordBreak="break-word"
      _hover={{ bg: bg ? bg : "#4559b3" }}
      aria-label={label}
    >
      <Box as="span" mr={2}>
        {icon}
      </Box>
      {text}
      <VisuallyHidden>{hasCopied ? "已複製" : "未複製"}</VisuallyHidden>
    </Button>
  );
}

