import {
  Link
} from "@chakra-ui/react";

export function CustomLink({ href, label }) {
  return (
    <Link
      key={label}
      href={href}
      isExternal
      px={4}
      py={2}
      borderRadius="md"
      fontWeight="bold"
      fontSize="md"
      color="#a3aaff"
      _hover={{ color: "#d6d6ff" }}
      _focus={{ boxShadow: "outline" }}
      onClick={(e) => e.stopPropagation()}
      boxShadow="0 3px 8px rgba(255,255,255,0.2)"

    >
      {label}
    </Link>
  );
}
