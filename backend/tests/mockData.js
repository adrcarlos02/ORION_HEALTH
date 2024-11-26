const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    password: "$2b$10$hashedPassword1", // bcrypt hashed password
    phone: "1234567890",
    gender: "Male",
    dob: "1990-01-01",
    address: { line1: "123 Main St", line2: "Apt 4B" },
    image: "http://example.com/johndoe.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    password: "$2b$10$hashedPassword2",
    phone: "0987654321",
    gender: "Female",
    dob: "1985-05-15",
    address: { line1: "456 Elm St", line2: "Suite 5C" },
    image: "http://example.com/janesmith.jpg",
  },
];

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Alice Johnson",
    email: "alicejohnson@example.com",
    password: "$2b$10$hashedPassword3",
    speciality: "Cardiologist",
    degree: "MD",
    experience: 10,
    about: "Expert in cardiovascular treatments.",
    fees: 150,
    available: true,
    address: { line1: "789 Pine St", line2: "Office 2A" },
  },
  {
    id: 2,
    name: "Dr. Bob Miller",
    email: "bobmiller@example.com",
    password: "$2b$10$hashedPassword4",
    speciality: "Dermatologist",
    degree: "MD",
    experience: 8,
    about: "Specialist in skin care.",
    fees: 120,
    available: false,
    address: { line1: "321 Oak St", line2: "Office 1B" },
  },
];

const mockAppointments = [
  {
    id: 1,
    userId: 1,
    docId: 1,
    slotDate: "2024-11-30",
    slotTime: "10:00 AM",
    amount: 150,
    cancelled: false,
    payment: true,
    isCompleted: false,
  },
  {
    id: 2,
    userId: 2,
    docId: 2,
    slotDate: "2024-12-01",
    slotTime: "2:00 PM",
    amount: 120,
    cancelled: false,
    payment: false,
    isCompleted: false,
  },
];

export { mockUsers, mockDoctors, mockAppointments };