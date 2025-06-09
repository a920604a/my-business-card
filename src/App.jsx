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
  touchAction: "manipulation",
};

const cardStyles = {
  width: "100%",
  maxWidth: "500px",
  aspectRatio: "5 / 3", // 保持名片比例
  margin: "0 auto",
  position: "relative",
  cursor: "pointer",
  transformStyle: "preserve-3d",
  transition: "transform 0.7s ease-in-out",
  boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
  borderRadius: "20px",
  bgGradient: "linear(to-br, #4c57a9, #6a73d6)",
  userSelect: "none",
  overflow: "hidden",
};

const faceStyles = {
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "20px",
  padding: { base: "24px", md: "32px" },
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
    fetch(`${import.meta.env.BASE_URL}data.json`)
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
        minH="100vh"
        bgGradient="linear(to-tr, #667eea, #764ba2)"
        fontFamily="'Noto Sans TC', sans-serif"
        color="white"
        align="center"
        justify="center"
        px={4}
        userSelect="none"
        sx={{ WebkitTapHighlightColor: "transparent" }}
      >
        <Box sx={flipStyles} w="100%" maxW="500px">
          <Box
            sx={cardStyles}
            onClick={() => setFlipped(!flipped)}
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setFlipped(!flipped);
            }}
            transform={flipped ? "rotateY(180deg)" : "none"}
          >
            {/* 正面 */}
            <Box
              sx={faceStyles}
              bg="rgba(255, 255, 255, 0.14)"
              boxShadow="inset 0 0 40px rgba(255,255,255,0.2)"
              color="white"
              textAlign="center"
            >
              <Heading as="h1" size="xl" mb={3}>
                {data.name}
              </Heading>
              <Heading as="h3" size="md" mb={1} fontWeight="600" color="#d5d9ff">
                {data.title}
              </Heading>
              <Text fontSize="md" fontWeight="400" color="#b3baff">
                {data.company}
              </Text>
            </Box>

            {/* 背面 */}
            <Box
              sx={faceStyles}
              bg="rgba(255, 255, 255, 0.08)"
              boxShadow="inset 0 0 40px rgba(0,0,0,0.4)"
              transform="rotateY(180deg)"
              color="#eaeaff"
              fontSize="16px"
              justifyContent="space-between"
              gap={4}
            >
              <Box display="flex" flexDirection="column" gap={3}>
                <CopyButton label={`複製電話 ${data.phone}`} text={data.phone} icon="📞" />
                <CopyButton label={`複製電子郵件 ${data.email}`} text={data.email} icon="📧" />
                <Flex justify="center" gap={4} fontSize="16px" flexWrap="wrap">
                  {[
                    { label: "LinkedIn", href: data.linkedin },
                    { label: "GitHub", href: data.github },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      isExternal
                      px={4}
                      py={2}
                      borderRadius="16px"
                      fontWeight="700"
                      color="#9faeff"
                      bg="rgba(255,255,255,0.2)"
                      _hover={{ bg: "rgba(255,255,255,0.35)" }}
                      onClick={(e) => e.stopPropagation()}
                      boxShadow="0 3px 8px rgba(255,255,255,0.2)"
                    >
                      {label}
                    </Link>
                  ))}
                </Flex>
              </Box>

              <Box mt={2} textAlign="center">
                <Box
                  mx="auto"
                  maxW={{ base: "120px", md: "160px" }}
                  p={2}
                  bg="white"
                  borderRadius="16px"
                >
                  <ReactQRCode value={data.website} size={128} />
                </Box>
                <Text fontSize="sm" color="#b0b6ffcc" mt={2}>
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
      _active={{ bg: "#3f4f9c" }}
      boxShadow="0 6px 12px rgba(86,103,201,0.5)"
      borderRadius="10px"
      fontSize="18px"
      fontWeight="700"
      textAlign="left"
      p="14px 20px"
      whiteSpace="normal"
      wordBreak="break-word"
      _hover={{ bg: "#4559b3" }}
      aria-label={label}
      width="100%"
    >
      <Box as="span" mr={2}>
        {icon}
      </Box>
      {text}
      <VisuallyHidden>{hasCopied ? "已複製" : "未複製"}</VisuallyHidden>
    </Button>
  );
}
