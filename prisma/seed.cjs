const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function upsertCategory(name, description) {
  const existing = await prisma.category.findUnique({ where: { name } });

  if (existing) {
    return prisma.category.update({
      where: { id: existing.id },
      data: { description },
    });
  }

  return prisma.category.create({
    data: { name, description },
  });
}

async function upsertCourse(data) {
  const existing = await prisma.course.findFirst({
    where: { title: data.title },
  });

  if (existing) {
    return prisma.course.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.course.create({ data });
}

async function upsertImage(data) {
  const existing = await prisma.image.findFirst({
    where: { title: data.title },
  });

  if (existing) {
    return prisma.image.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.image.create({ data });
}

async function main() {
  const adminPassword = await bcrypt.hash("admin10203", 10);

  await prisma.user.upsert({
    where: { email: "admin@nouracademy.com" },
    update: {
      name: "Nour Academy Admin",
      hashePassword: adminPassword,
      role: "Admin",
    },
    create: {
      name: "Nour Academy Admin",
      email: "admin@nouracademy.com",
      hashePassword: adminPassword,
      role: "Admin",
    },
  });

  const mathCategory = await upsertCategory(
    "الرياضيات",
    "فئة تجريبية لاختبار مسارات الرياضيات داخل مدرسة النور."
  );
  const physicsCategory = await upsertCategory(
    "الفيزياء",
    "فئة تجريبية لاختبار مسارات الفيزياء داخل مدرسة النور."
  );

  await upsertCourse({
    title: "أساسيات الجبر والدوال",
    description:
      "دورة تجريبية في الرياضيات تركّز على الجبر، المعادلات، والدوال بأسلوب واضح ومتدرج. تم إعدادها لاختبار ظهور الدورات في الواجهة الرئيسية، صفحة التفاصيل، ولوحة الإدارة داخل مدرسة النور.",
    image: "/images/logo.png",
    categoryId: mathCategory.id,
    instructor: "أ. محمد نور الدين",
    date: new Date("2026-06-15T10:00:00.000Z"),
    location: "الجزائر العاصمة - حضوري/أونلاين",
    price: 4500,
    phone: "+213540153806",
    email: "admin@nouracademy.com",
    featured: true,
    inFront: true,
  });

  await upsertCourse({
    title: "مدخل إلى الميكانيك والكهرباء",
    description:
      "دورة تجريبية في الفيزياء تشرح مفاهيم الحركة، القوى، والطاقة الكهربائية مع أمثلة وتمارين مبسطة. أُضيفت خصيصاً لاختبار التكامل الكامل بين قاعدة البيانات والواجهة الأمامية.",
    image: "/images/logo.png",
    categoryId: physicsCategory.id,
    instructor: "أ. سارة لعموري",
    date: new Date("2026-06-22T14:00:00.000Z"),
    location: "الجزائر العاصمة - حضوري/أونلاين",
    price: 5000,
    phone: "+213540153806",
    email: "admin@nouracademy.com",
    featured: false,
    inFront: true,
  });

  await upsertImage({
    title: "هوية مدرسة النور",
    description: "صورة تجريبية للهوية البصرية داخل المعرض.",
    url: "/images/logo.png",
    alt: "شعار مدرسة النور",
    order: 0,
    isActive: true,
  });

  await upsertImage({
    title: "واجهة المنصة",
    description: "عنصر تجريبي يدعم معرض الصور في صفحات الدورات.",
    url: "/images/about-image.jpg",
    alt: "واجهة تعليمية لمدرسة النور",
    order: 1,
    isActive: true,
  });

  console.log("Seed complete: admin user, categories, courses, and gallery images are ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
