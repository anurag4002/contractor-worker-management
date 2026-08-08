import Worker from '../models/Worker.js';
import Site from '../models/Site.js';
import User from '../models/User.js';

import logger from '../common/logger/logger.js';

import { faker } from '@faker-js/faker';

const TRADES = [
  'MASON', 'HELPER', 'ELECTRICIAN', 'PLUMBER', 'CARPENTER',
  'WELDER', 'PAINTER', 'STEEL_FIXER', 'OPERATOR', 'OTHER',
];

const SKILL_LEVELS = ['UNSKILLED', 'SEMI_SKILLED', 'SKILLED'];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DEPARTMENTS = [
  'Construction', 'Electrical', 'Plumbing', 'Carpentry',
  'Painting', 'Welding', 'Steel Fixing', 'Operating',
  'Site Supervision', 'General',
];

const INDIAN_FIRST_NAMES = [
  'Amit', 'Rahul', 'Priya', 'Sunita', 'Rajesh', 'Meena', 'Suresh', 'Kavita',
  'Anil', 'Rekha', 'Vikram', 'Deepa', 'Manoj', 'Lakshmi', 'Arun', 'Shalini',
  'Sandeep', 'Pooja', 'Ravi', 'Anita', 'Kumar', 'Neha', 'Ajay', 'Meera',
  'Sanjay', 'Roshni', 'Mukesh', 'Divya', 'Nikhil', 'Shruti', 'Rohit', 'Pooja',
  'Akshay', 'Tanvi', 'Varun', 'Kriti', 'Saurabh', 'Pari', 'Abhishek', 'Shreya',
  'Naveen', 'Archana', 'Pradeep', 'Kavya', 'Rakesh', 'Swati', 'Harish', 'Geeta',
  'Srinivas', 'Lata', 'Gopal', 'Usha', 'Mahesh', 'Rani', 'Karthik', 'Amrita',
  'Vijay', 'Shweta', 'Manoj', 'Pooja', 'Ravi', 'Sita', 'Ganesh', 'Lakshmi',
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Jain', 'Reddy', 'Nair',
  'Das', 'Mukherjee', 'Iyer', 'Menon', 'Nair', 'Pillai', 'Nair', 'Shah',
  'Patel', 'Sharma', 'Singh', 'Yadav', 'Kumar', 'Verma', 'Das', 'Gupta',
  'Jain', 'Shah', 'Mehta', 'Bhatia', 'Chandra', 'Rao', 'Nair', 'Menon',
  'Iyer', 'Pillai', 'Reddy', 'Patel', 'Sharma', 'Singh', 'Kumar', 'Gupta',
];

const DELHI_LOCALITIES = [
  'Dwarka', 'Rohini', 'Saket', 'Karol Bagh', 'Lajpat Nagar',
  'Janakpuri', 'Punjabi Bagh', 'Rajouri Garden', 'Pitampura', 'Shahdara',
  'Mayur Vihar', 'Noida', 'Greater Noida', 'Gurgaon', 'Manesar',
  'Faridabad', 'Ghaziabad', 'Delhi Cantonment', 'Vasant Vihar', 'Hauz Khas',
];

const generateAadhaar = () => {
  let aadhaar = '';
  for (let i = 0; i < 12; i++) {
    aadhaar += Math.floor(Math.random() * 10);
  }
  return aadhaar;
};

const generatePAN = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let pan = '';
  for (let i = 0; i < 5; i++) pan += chars[Math.floor(Math.random() * 26)];
  for (let i = 0; i < 4; i++) pan += digits[Math.floor(Math.random() * 10)];
  pan += chars[Math.floor(Math.random() * 26)];
  return pan;
};

const generateESIC = () => {
  let esic = '';
  for (let i = 0; i < 10; i++) {
    esic += Math.floor(Math.random() * 10);
  }
  return esic;
};

const generatePF = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pf = '';
  for (let i = 0; i < 12; i++) {
    pf += chars[Math.floor(Math.random() * chars.length)];
  }
  return pf;
};

const generateMobile = () => {
  return `9${String(Math.floor(Math.random() * 900000000) + 100000000)}`;
};

const generateEmail = (index) => {
  const first = INDIAN_FIRST_NAMES[index % INDIAN_FIRST_NAMES.length].toLowerCase();
  const last = INDIAN_LAST_NAMES[index % INDIAN_LAST_NAMES.length].toLowerCase();
  return `${first}.${last}${index}@email.com`;
};

const generateEmployeeCode = (index) => {
  return `WRK${String(100000 + index)}`;
};

const seedWorkers = async () => {
  logger.info('Seeding workers...');

  const sites = await Site.find({ isDeleted: false, status: 'ACTIVE' });
  const adminUser = await User.findOne({ email: 'admin@contractor.com', isDeleted: false });
  const createdBy = adminUser ? adminUser._id : null;

  const totalWorkers = 155;

  const workersWithoutSite = Math.floor(totalWorkers * 0.08);
  const inactiveWorkers = Math.floor(totalWorkers * 0.1);
  const duplicateNameCount = 5;

  const records = [];

  for (let i = 0; i < totalWorkers; i++) {
    const firstName = INDIAN_FIRST_NAMES[i % INDIAN_FIRST_NAMES.length];
    const lastName = INDIAN_LAST_NAMES[i % INDIAN_LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    const isWithoutSite = i < workersWithoutSite;
    const isInactive = i >= totalWorkers - inactiveWorkers;
    const isDuplicate = i < duplicateNameCount;

    const workerData = {
      employeeCode: generateEmployeeCode(i),
      fullName: isDuplicate ? `${firstName} ${lastName}` : fullName,
      fatherName: `${INDIAN_FIRST_NAMES[(i + 10) % INDIAN_FIRST_NAMES.length]} ${INDIAN_LAST_NAMES[(i + 10) % INDIAN_LAST_NAMES.length]}`,
      mobileNumber: generateMobile(),
      email: generateEmail(i),
      gender: Math.random() > 0.3 ? 'MALE' : Math.random() > 0.5 ? 'FEMALE' : 'OTHER',
      dateOfBirth: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
      bloodGroup: BLOOD_GROUPS[Math.floor(Math.random() * BLOOD_GROUPS.length)],
      aadhaarNumber: generateAadhaar(),
      panNumber: generatePAN(),
      esicNumber: generateESIC(),
      pfNumber: generatePF(),
      address: `${faker.location.streetAddress()}`,
      state: 'Haryana',
      district: 'Gurugram',
      city: DELHI_LOCALITIES[i % DELHI_LOCALITIES.length],
      pincode: String(Math.floor(Math.random() * 90000) + 10000),
      trade: TRADES[i % TRADES.length],
      skillLevel: SKILL_LEVELS[i % SKILL_LEVELS.length],
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      site: isWithoutSite ? null : sites[i % sites.length]._id,
      contractor: createdBy,
      joiningDate: faker.date.past({ years: 3, refDate: '2026-01-01' }),
      salaryType: Math.random() > 0.5 ? 'DAILY' : 'MONTHLY',
      dailyWage: Math.random() > 0.5 ? Math.floor(Math.random() * 1501) + 500 : 0,
      monthlySalary: Math.random() > 0.5 ? Math.floor(Math.random() * 57001) + 18000 : 0,
      emergencyContactName: `${INDIAN_FIRST_NAMES[(i + 20) % INDIAN_FIRST_NAMES.length]} ${INDIAN_LAST_NAMES[(i + 20) % INDIAN_LAST_NAMES.length]}`,
      emergencyContactNumber: `9${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
      relationship: 'Brother',
      status: isInactive ? 'INACTIVE' : 'ACTIVE',
      createdBy,
      updatedBy: createdBy,
    };

    records.push(workerData);
  }

  if (records.length > 0) {
    await Worker.insertMany(records, { ordered: false });
  }

  logger.info(`Workers created: ${records.length}`);
  return { count: records.length };
};

export default seedWorkers;