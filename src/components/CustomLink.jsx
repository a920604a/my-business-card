import {
  Link
} from "@chakra-ui/react";

export function CustomLink({ href, label }) {
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
