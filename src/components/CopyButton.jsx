import {
  Button,
  useClipboard,
  VisuallyHidden,
  Tooltip,
} from "@chakra-ui/react";
export function CopyButton({ label, text, icon, color }) {
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
      color={color}   // 這裡用傳進來的 color
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