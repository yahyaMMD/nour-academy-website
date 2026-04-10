import { Tag } from "./tag"
import { IntegrationColumns } from "./integration-column"

const partners = [
  {
    name: "YOUJOY",
    icon: "/images/YOUJOY.png",
    description: "متخصص في أجهزة التصوير الشعاعي السني، ويوفر حلول تصوير تشخيصي عالية الدقة.",
  },
  {
    name: "Anthos",
    icon: "/images/Anthos.png",
    description: "مصنّع لأدوات الأسنان اليدوية والتوربينات بدقة جراحية ومتانة عالية.",
  },
  {
    name: "MyRay",
    icon: "/images/mayray.png",
    description: "مزود لأنظمة تصوير الأسنان ثنائية وثلاثية الأبعاد ومعدات أشعة مبتكرة.",
  },
  {
    name: "W&H",
    icon: "/images/W&H.png",
    description: "رائد في تقنيات الطحن السني وحلول الزراعة المتقدمة للمخابر.",
  },
  {
    name: "Sirio",
    icon: "/images/Sirio.png",
    description: "مصمم لمعدات مخابر الأسنان الاحترافية، بما في ذلك أفران السيراميك وأجهزة البلمرة.",
  },
  {
    name: "Soco",
    icon: "/images/Soco.png",
    description: "خبير في الحساسات الرقمية داخل الفم لتصوير سني سريع وموثوق.",
  },
  {
    name: "coxo",
    icon: "/images/coxo.png",
    description: "رائد في مواد الأسنان عالية الأداء لترميمات جمالية ومتينة.",
  }
];

export const Integrations = () => {
  return (
    <section className="py-24 overflow-hidden " dir="rtl">
      <div className="container">
        <div className="grid lg:grid-cols-2 items-center lg:gap-16">
          <div>
            <Tag>شركاؤنا</Tag>
            <h2 className="text-5xl lg:text-6xl text-gray-800 font-medium mt-6">
              شراكات مع <span style={{ color: '#6C3C74' }}>رواد عالميين</span>
              في تجهيزات طب الأسنان
            </h2>
            <p className="text-lg text-gray-600 mt-6 max-w-lg">
              نختار شركاءنا بعناية لنقدم تجهيزات معتمدة وعالية الأداء، مناسبة لاحتياجات عيادات الأسنان الحديثة.
            </p>
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              خبرتنا التقنية تساعدك على اختيار الحلول الأنسب لطبيعة عملك.
            </p>
          </div>

          <div>
            <div className="h-[800px] grid md:grid-cols-2 gap-4 mt-8 lg:mt-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,to_black_90%,transparent)]">
              <IntegrationColumns integrations={partners} />
              <IntegrationColumns
                integrations={partners.slice().reverse()}
                className="hidden md:flex"
                reverse={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
