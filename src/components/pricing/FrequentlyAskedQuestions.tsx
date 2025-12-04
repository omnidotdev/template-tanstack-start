import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import app from "@/lib/config/app.config";
import cn from "@/lib/utils";

const FAQ = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll be prorated the difference. When you downgrade, you'll receive credit for your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept a wide variety of payment methods, including all major credit card providers and PayPal.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "If you cancel your subscription, your data will be safe on our servers unless you explicitly reach out to us to permanently delete it, or we contact you to warn about deletion. We will never delete your data without your explicit consent or without fair warning from us.",
  },
  {
    question: "Can I self-host this software?",
    answer: `Yes! ${app.name} is open source software. Instructions for self-hosting will be available soon.`,
  },
];

interface Props {
  className?: string;
}

const FrequentlyAskedQuestions = ({ className }: Props) => {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <h1 className="font-bold text-lg">Frequently Asked Questions</h1>

      <AccordionRoot multiple className="w-full max-w-2xl">
        {FAQ.map((item) => (
          <AccordionItem
            key={item.question}
            value={item.question}
            className="text-start"
          >
            <AccordionItemTrigger className="font-semibold">
              {item.question}
            </AccordionItemTrigger>

            <AccordionItemContent className="pr-8 text-muted-foreground">
              {item.answer}
            </AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </div>
  );
};

export default FrequentlyAskedQuestions;
