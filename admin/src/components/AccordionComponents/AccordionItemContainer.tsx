import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from "@chakra-ui/react";

interface AccordionItemContainerProps {
  color: string;
  title: string;
}

const AccordionItemContainer: React.FC<AccordionItemContainerProps> = ({
  color,
  title,

  children,
}) => {
  return (
    <AccordionItem>
      <AccordionButton _expanded={{ bg: color, color: "white" }}>
        <Box flex="1" textAlign="left">
          <Heading fontSize={18} m={2}>
            {title}
          </Heading>
        </Box>
        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel pb={4}>{children}</AccordionPanel>
    </AccordionItem>
  );
};
export default AccordionItemContainer;
