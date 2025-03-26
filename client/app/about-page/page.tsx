'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      bio: 'Với hơn 15 năm kinh nghiệm trong ngành công nghệ, anh A đã xây dựng ShopTech từ một cửa hàng nhỏ thành một trong những nhà bán lẻ công nghệ hàng đầu.'
    },
    {
      name: 'Trần Thị B',
      role: 'COO',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      bio: 'Chị B là người đứng sau sự vận hành suôn sẻ của ShopTech. Với kinh nghiệm quản lý chuỗi cung ứng, chị đảm bảo mọi sản phẩm đều đạt chất lượng cao nhất.'
    },
    {
      name: 'Lê Văn C',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      bio: 'Anh C là chuyên gia công nghệ với hơn 10 năm kinh nghiệm. Anh chịu trách nhiệm về mọi khía cạnh kỹ thuật của ShopTech, từ website đến hệ thống quản lý kho.'
    },
    {
      name: 'Phạm Thị D',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      bio: 'Chị D là người đứng sau những chiến dịch marketing thành công của ShopTech. Với sự sáng tạo và hiểu biết sâu sắc về thị trường, chị đã giúp ShopTech xây dựng thương hiệu mạnh mẽ.'
    }
  ];

  const coreValues = [
    {
      title: 'Chất lượng',
      description: 'Chúng tôi cam kết cung cấp những sản phẩm công nghệ chất lượng cao nhất, được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.',
      icon: '🏆'
    },
    {
      title: 'Đổi mới',
      description: 'Luôn cập nhật những xu hướng công nghệ mới nhất, đảm bảo khách hàng tiếp cận được với những sản phẩm tiên tiến nhất.',
      icon: '💡'
    },
    {
      title: 'Tận tâm',
      description: 'Đặt khách hàng làm trung tâm, chúng tôi luôn lắng nghe và đáp ứng mọi nhu cầu với dịch vụ chăm sóc khách hàng tận tâm.',
      icon: '❤️'
    },
    {
      title: 'Trách nhiệm',
      description: 'Chúng tôi cam kết kinh doanh có trách nhiệm, quan tâm đến môi trường và cộng đồng thông qua các hoạt động xã hội.',
      icon: '🌍'
    }
  ];

  const milestones = [
    { year: 2015, event: 'Thành lập ShopTech với cửa hàng đầu tiên tại TP.HCM' },
    { year: 2017, event: 'Mở rộng với 5 cửa hàng trên toàn quốc' },
    { year: 2019, event: 'Ra mắt nền tảng thương mại điện tử ShopTech.vn' },
    { year: 2021, event: 'Trở thành đối tác chính thức của các thương hiệu công nghệ hàng đầu' },
    { year: 2023, event: 'Đạt mốc 100,000 khách hàng thân thiết và mở rộng sang thị trường Đông Nam Á' }
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <motion.section
        className="text-center mb-16 max-w-[1400px] mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Về Chúng Tôi</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          ShopTech là nhà bán lẻ công nghệ hàng đầu, cung cấp các sản phẩm công nghệ chất lượng cao
          cùng dịch vụ khách hàng xuất sắc. Chúng tôi tự hào mang đến trải nghiệm mua sắm tuyệt vời
          cho khách hàng từ năm 2015.
        </p>
      </motion.section>

      {/* Our Story */}
      <motion.section
        className="mb-20 max-w-[1400px] mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Câu Chuyện Của Chúng Tôi</h2>
            <p className="text-gray-600 mb-4">
              ShopTech được thành lập vào năm 2015 bởi một nhóm những người đam mê công nghệ với tầm nhìn
              mang đến những sản phẩm công nghệ chất lượng cao với giá cả hợp lý cho người tiêu dùng Việt Nam.
            </p>
            <p className="text-gray-600 mb-4">
              Từ một cửa hàng nhỏ tại TP.HCM, chúng tôi đã phát triển thành một trong những nhà bán lẻ
              công nghệ hàng đầu với hơn 20 cửa hàng trên toàn quốc và nền tảng thương mại điện tử phục vụ
              hàng trăm nghìn khách hàng mỗi tháng.
            </p>
            <p className="text-gray-600">
              Sứ mệnh của chúng tôi là đơn giản hóa công nghệ và làm cho nó trở nên dễ tiếp cận hơn với
              mọi người, đồng thời cung cấp dịch vụ khách hàng xuất sắc và hỗ trợ kỹ thuật chuyên nghiệp.
            </p>
          </div>
          <div className="md:w-1/2 relative h-[400px]">
            <div className="absolute w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg transform rotate-3"></div>
            <div className="absolute w-full h-full overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="ShopTech store"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Core Values */}
      <motion.section
        className="mb-20 max-w-[1400px] mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-3xl font-bold mb-10 text-center">Giá Trị Cốt Lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              variants={fadeIn}
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="mb-20 max-w-[1400px] mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-3xl font-bold mb-10 text-center">Đội Ngũ Của Chúng Tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              variants={fadeIn}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Milestones */}
      <motion.section
        className="mb-20 max-w-[1400px] mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-10 text-center">Hành Trình Phát Triển</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>

          {/* Timeline items */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2"></div>
                <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  {milestone.year}
                </div>
                <div className="w-1/2 p-4">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">{milestone.year}</h3>
                    <p className="text-gray-600">{milestone.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-lg max-w-[1400px] mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-6">Hãy Trở Thành Một Phần Của Chúng Tôi</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Chúng tôi luôn tìm kiếm những người tài năng và đam mê công nghệ để gia nhập đội ngũ ShopTech.
          Nếu bạn muốn làm việc trong một môi trường năng động và sáng tạo, hãy liên hệ với chúng tôi.
        </p>
        <button className="bg-white text-blue-600 hover:bg-gray-100 transition-colors duration-200 font-bold py-3 px-8 rounded-full text-lg">
          Cơ Hội Nghề Nghiệp
        </button>
      </motion.section>
    </div>
  );
}
