import { motion } from "framer-motion";
import { Container } from "./Container";
import { FadeIn } from "./FadeIn";

const pillars = [
  {
    title: "نفهم الطالب قبل أن نعلّمه",
    description:
      "نعرف أن الطالب لا يحتاج فقط إلى درس جديد، بل إلى طريقة تشرح له الفكرة من جذورها وتجعله يثق في نفسه من جديد.",
    color: "bg-[var(--brand-primary-soft)]",
  },
  {
    title: "نحوّل الضغط إلى دافع",
    description:
      "بدل الشعور بالتشتت أو الخوف من التراجع، نصنع بيئة تشجع على المحاولة، الأسئلة، والتقدم خطوة بعد خطوة.",
    color: "bg-[var(--brand-accent-soft)]",
  },
  {
    title: "النتيجة تبدأ من التجربة",
    description:
      "كل تفصيل في المدرسة صُمم ليمنح الطالب شعورا بالوضوح والجدية والانتماء، لأن الأداء القوي يبدأ من إحساس داخلي قوي.",
    color: "bg-[var(--brand-highlight-soft)]",
  },
];

const stats = [
  { label: "رؤية المدرسة", value: "تفوق", color: "text-[var(--brand-primary)]" },
  { label: "أسلوبنا", value: "واضح", color: "text-[var(--brand-accent)]" },
  { label: "أثرنا", value: "ثقة", color: "text-[var(--brand-ink)]" },
];

const About = () => {
  return (
    <section id="about" className="py-20" dir="rtl">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            className="brand-panel rounded-[2rem] p-8"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true }}
          >
            <p className="mb-4 text-sm font-semibold text-[var(--brand-primary)]">من نحن</p>
            <h2 className="mb-5 font-[var(--font-brand-heading)] text-3xl font-extrabold leading-[1.45] text-[var(--brand-ink)] md:text-4xl">
              مدرسة تؤمن أن الطالب حين يفهم جيدا
              <span className="text-[var(--brand-accent)]"> يقدر أن يتفوق بثبات.</span>
            </h2>
            <p className="mb-6 text-lg leading-8 text-[var(--brand-muted)]">
              في مدرسة النور لا نقدم محتوى تعليميا باردا أو مكررا. نحن نبني تجربة كاملة تجعل الطالب أكثر تركيزا،
              أكثر راحة، وأكثر استعدادا ليبذل جهده لأنه يرى الطريق أمامه بوضوح.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                  <p className={`mb-2 text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-[var(--brand-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-5">
            <FadeIn>
              <div className="grid gap-5 md:grid-cols-3">
                {pillars.map((pillar, index) => (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`rounded-[1.75rem] p-6 shadow-sm ring-1 ring-black/5 ${pillar.color}`}
                  >
                    <h3 className="mb-3 font-[var(--font-brand-heading)] text-xl font-bold text-[var(--brand-ink)]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-7 text-[var(--brand-muted)]">{pillar.description}</p>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;
