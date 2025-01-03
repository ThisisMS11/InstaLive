import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        question: 'What makes our platform different?',
        answer: 'Our platform combines cutting-edge technology with intuitive design, offering a seamless experience that sets us apart from traditional solutions.',
    },
    {
        question: 'How secure is your service?',
        answer: 'We implement enterprise-grade security measures, including end-to-end encryption and regular security audits, to ensure your data remains protected.',
    },
    {
        question: 'Do you offer customer support?',
        answer: 'Yes, we provide 24/7 customer support through multiple channels including live chat, email, and phone support to ensure you always have help when needed.',
    },
    {
        question: 'Can I try before subscribing?',
        answer: "Absolutely! We offer a 14-day free trial with full access to all features, allowing you to experience the platform's capabilities firsthand.",
    },
];

const FaqSection = () => {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl mb-4">
                        <span className="bg-gradient-to-tr from-primary to-green-800 bg-clip-text text-transparent font-extrabold">
                            FAQs
                        </span>
                        {''}
                        <div className="text-5xl">related to product</div>
                    </h2>
                    <p className="max-w-lg mx-auto">
                        Find answers to common questions
                    </p>
                </div>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                >
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className=" rounded-lg px-4 bg-accent/50 backdrop-blur-sm"
                        >
                            <AccordionTrigger className="dark:text-primary hover:text-primary/90">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="dark:text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default FaqSection;
