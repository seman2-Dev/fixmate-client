import type { Booking, Payment, Service, User } from "./types";

/**
 * Temporary mock data for Phase 1 (frontend only).
 * Phase 2 replaces every read/write in `data-store.tsx` with Express API calls.
 * All demo accounts share the password below (client-side only, never real auth).
 */
export const DEMO_PASSWORD = "FixMate1";

export interface MockUser extends User {
  password: string;
}

export const seedUsers: MockUser[] = [
  {
    _id: "u_admin",
    name: "Semanto Bolbol",
    email: "admin@fixmate.dev",
    image: "",
    role: "admin",
    phone: "+880 1700-000001",
    area: "Rajshahi, Rajshahi",
    bio: "Platform admin at FixMate. Keeps listings honest and payouts flowing.",
    createdAt: "2026-01-05T09:00:00.000Z",
    password: DEMO_PASSWORD,
  },
  {
    _id: "u_tech1",
    name: "Rafiq Hasan",
    email: "rafiq@fixmate.dev",
    image: "",
    role: "technician",
    phone: "+880 1711-223344",
    area: "Mirpur, Dhaka",
    bio: "Certified mobile & laptop repair technician with 9 years of bench experience. Board-level soldering, screen and battery swaps, data recovery.",
    createdAt: "2026-02-10T09:00:00.000Z",
    password: DEMO_PASSWORD,
  },
  {
    _id: "u_tech2",
    name: "Nusrat Jahan",
    email: "nusrat@fixmate.dev",
    image: "",
    role: "technician",
    phone: "+880 1722-556677",
    area: "Dhanmondi, Dhaka",
    bio: "HVAC and refrigeration engineer. Gas charging, compressor repair and preventive servicing for homes and small offices.",
    createdAt: "2026-02-18T09:00:00.000Z",
    password: DEMO_PASSWORD,
  },
  {
    _id: "u_tech3",
    name: "Imran Khan",
    email: "imran@fixmate.dev",
    image: "",
    role: "technician",
    phone: "+880 1733-889900",
    area: "Uttara, Dhaka",
    bio: "Licensed electrician and appliance specialist. TVs, washing machines and safe residential wiring.",
    createdAt: "2026-03-02T09:00:00.000Z",
    password: DEMO_PASSWORD,
  },
  {
    _id: "u_cust1",
    name: "Ayesha Rahman",
    email: "ayesha@fixmate.dev",
    image: "",
    role: "customer",
    phone: "+880 1811-100200",
    area: "Banani, Dhaka",
    bio: "",
    createdAt: "2026-04-12T09:00:00.000Z",
    password: DEMO_PASSWORD,
  },
  {
    _id: "u_cust2",
    name: "Tanvir Ahmed",
    email: "tanvir@fixmate.dev",
    image: "",
    role: "customer",
    phone: "+880 1822-300400",
    area: "Mohammadpur, Dhaka",
    bio: "",
    createdAt: "2026-05-03T09:00:00.000Z",
    password: DEMO_PASSWORD,
  },
  {
    _id: "u_cust3",
    name: "Sadia Islam",
    email: "sadia@fixmate.dev",
    image: "",
    role: "customer",
    phone: "+880 1833-500600",
    area: "Bashundhara, Dhaka",
    bio: "",
    createdAt: "2026-06-21T09:00:00.000Z",
    password: DEMO_PASSWORD,
  },
];

type ServiceSeed = Omit<Service, "createdAt" | "technicianName"> & {
  daysAgo: number;
};

const tech = {
  "rafiq@fixmate.dev": "Rafiq Hasan",
  "nusrat@fixmate.dev": "Nusrat Jahan",
  "imran@fixmate.dev": "Imran Khan",
} as const;

const NOW = new Date("2026-11-17T08:00:00.000Z").getTime();
const daysAgo = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

const serviceSeeds: ServiceSeed[] = [
  {
    _id: "svc_01",
    title: "iPhone Screen Replacement",
    category: "Smartphone",
    description:
      "Genuine-grade OLED screen replacement for iPhone 11 to 15 series. Includes adhesive reseal, touch and Face ID check, and a 90-day warranty on the panel. Most repairs finish while you wait.",
    image: "/services/s01.svg", // https://ibb.co/gM38Tf7W
    basePrice: 85,
    estimatedDuration: "1-2 hours",
    serviceMode: "Shop Drop-off",
    serviceArea: "Mirpur, Dhaka",
    technicianEmail: "rafiq@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 2,
  },
  {
    _id: "svc_02",
    title: "Android Battery & Charging Port Fix",
    category: "Smartphone",
    description:
      "Swap swollen or fast-draining batteries and repair loose or dead USB-C and micro-USB ports for Samsung, Xiaomi, Oppo and Realme devices. Includes a full charging-circuit diagnostic.",
    image: "/services/s02.svg", // https://ibb.co/99BXmjKv
    basePrice: 35,
    estimatedDuration: "2-3 hours",
    serviceMode: "Home Visit",
    serviceArea: "Mirpur, Dhaka",
    technicianEmail: "rafiq@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 4,
  },
  {
    _id: "svc_03",
    title: "Laptop Deep Cleaning & Thermal Paste",
    category: "Laptop & PC",
    description:
      "Full internal dust removal, fan lubrication and fresh thermal paste to cure overheating and throttling. Includes a temperature benchmark before and after the service.",
    image: "/services/s03.svg", // https://ibb.co/3ynZL0Ms
    basePrice: 40,
    estimatedDuration: "3-4 hours",
    serviceMode: "Shop Drop-off",
    serviceArea: "Mirpur, Dhaka",
    technicianEmail: "rafiq@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 6,
  },
  {
    _id: "svc_04",
    title: "Laptop SSD Upgrade & Windows Setup",
    category: "Laptop & PC",
    description:
      "Clone your old drive to a new NVMe or SATA SSD, or run a clean Windows install with drivers. We move your files and verify everything boots before you take it home.",
    image: "/services/s04.svg", // https://ibb.co/NdHZbz1K
    basePrice: 55,
    estimatedDuration: "1 day",
    serviceMode: "Shop Drop-off",
    serviceArea: "Mirpur, Dhaka",
    technicianEmail: "rafiq@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 9,
  },
  {
    _id: "svc_05",
    title: "Split AC Servicing & Gas Check",
    category: "AC",
    description:
      "Indoor and outdoor unit wash, filter cleaning, drain-line clearing and refrigerant pressure check for split air conditioners up to 2 ton. Includes a cooling performance report.",
    image: "/services/s05.svg", // https://ibb.co/wr7k8ffZ
    basePrice: 30,
    estimatedDuration: "2 hours",
    serviceMode: "Home Visit",
    serviceArea: "Dhanmondi, Dhaka",
    technicianEmail: "nusrat@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 1,
  },
  {
    _id: "svc_06",
    title: "AC Compressor & PCB Repair",
    category: "AC",
    description:
      "Diagnosis and repair of compressors, capacitors and inverter control boards. We quote the exact fault before any part is replaced and keep the old parts for you to see.",
    image: "/services/s06.svg", // https://ibb.co/jZT6Hzkb
    basePrice: 95,
    estimatedDuration: "1 day",
    serviceMode: "Home Visit",
    serviceArea: "Dhanmondi, Dhaka",
    technicianEmail: "nusrat@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 7,
  },
  {
    _id: "svc_07",
    title: "Refrigerator Not Cooling Repair",
    category: "Refrigerator",
    description:
      "Fix warm fridges and freezers: thermostat, defrost heater, fan motor and gas leak repair for single and double-door models of all major brands. 30-day warranty on parts.",
    image: "/services/s07.svg", // https://ibb.co/mVSDqjSZ
    basePrice: 50,
    estimatedDuration: "3-5 hours",
    serviceMode: "Home Visit",
    serviceArea: "Dhanmondi, Dhaka",
    technicianEmail: "nusrat@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 11,
  },
  {
    _id: "svc_08",
    title: "Fridge Door Seal & Compressor Relay",
    category: "Refrigerator",
    description:
      "Replace worn door gaskets and failing start relays to stop frost build-up and noisy cycling. Parts are matched to your fridge model number.",
    image: "/services/s08.svg", // https://ibb.co/jvkTDc79
    basePrice: 28,
    estimatedDuration: "2 hours",
    serviceMode: "Home Visit",
    serviceArea: "Dhanmondi, Dhaka",
    technicianEmail: "nusrat@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 13,
  },
  {
    _id: "svc_09",
    title: "LED/LCD TV Backlight Repair",
    category: "TV",
    description:
      "Fix dim screens, dark corners and sound-but-no-picture faults by replacing LED backlight strips and power boards. Works with Sony, Samsung, LG, Walton and Singer TVs up to 65 inches.",
    image: "/services/s09.svg", // https://ibb.co/93zZMdzY
    basePrice: 60,
    estimatedDuration: "1 day",
    serviceMode: "Home Visit",
    serviceArea: "Uttara, Dhaka",
    technicianEmail: "imran@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 3,
  },
  {
    _id: "svc_10",
    title: "Smart TV Software & Wi-Fi Repair",
    category: "TV",
    description:
      "Reflash firmware, fix boot loops, restore app stores and repair Wi-Fi modules on Android and webOS TVs. Includes remote and HDMI-port testing.",
    image: "/services/s10.svg", // https://ibb.co/WWmcbn0g
    basePrice: 25,
    estimatedDuration: "1-2 hours",
    serviceMode: "Home Visit",
    serviceArea: "Uttara, Dhaka",
    technicianEmail: "imran@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 15,
  },
  {
    _id: "svc_11",
    title: "Washing Machine Drain & Spin Repair",
    category: "Washing Machine",
    description:
      "Repair water that will not drain, drums that will not spin and error codes on front-load and top-load machines. Pump, belt and bearing replacement available on the spot.",
    image: "/services/s11.svg", // https://ibb.co/zV8GRSVQ
    basePrice: 45,
    estimatedDuration: "2-4 hours",
    serviceMode: "Home Visit",
    serviceArea: "Uttara, Dhaka",
    technicianEmail: "imran@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 5,
  },
  {
    _id: "svc_12",
    title: "Washer Motor & Control Board Fix",
    category: "Washing Machine",
    description:
      "Rewind or replace motors and repair control boards on fully automatic washing machines. A written fault report is provided before work starts.",
    image: "/services/s12.svg", // https://ibb.co/Zp04QFfq
    basePrice: 70,
    estimatedDuration: "1 day",
    serviceMode: "Shop Drop-off",
    serviceArea: "Uttara, Dhaka",
    technicianEmail: "imran@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 18,
  },
  {
    _id: "svc_13",
    title: "Home Electrical Fault Finding",
    category: "Electrical",
    description:
      "Trace tripping breakers, flickering lights and dead sockets. Includes a safety inspection of your distribution board with photos and a clear list of what needs fixing.",
    image: "/services/s13.svg", // https://ibb.co/MF6k93s
    basePrice: 22,
    estimatedDuration: "1-2 hours",
    serviceMode: "Home Visit",
    serviceArea: "Uttara, Dhaka",
    technicianEmail: "imran@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 8,
  },
  {
    _id: "svc_14",
    title: "Room Rewiring & Switchboard Install",
    category: "Electrical",
    description:
      "Concealed or surface rewiring of a single room with ISI-grade copper wire, MCB-protected circuits and modular switchboards. Materials are quoted separately.",
    image: "/services/s14.svg", // https://ibb.co/RksBgWw3
    basePrice: 120,
    estimatedDuration: "1-2 days",
    serviceMode: "Home Visit",
    serviceArea: "Uttara, Dhaka",
    technicianEmail: "imran@fixmate.dev",
    approvalStatus: "approved",
    isAvailable: true,
    daysAgo: 20,
  },
  {
    _id: "svc_15",
    title: "Samsung Galaxy Water Damage Recovery",
    category: "Smartphone",
    description:
      "Ultrasonic cleaning and board-level repair for liquid-damaged phones. Free diagnosis, and you only pay if the phone powers back on.",
    image: "/services/s15.svg", // https://ibb.co/ymjqTt5n
    basePrice: 65,
    estimatedDuration: "2 days",
    serviceMode: "Shop Drop-off",
    serviceArea: "Mirpur, Dhaka",
    technicianEmail: "rafiq@fixmate.dev",
    approvalStatus: "pending",
    isAvailable: true,
    daysAgo: 0,
  },
  {
    _id: "svc_16",
    title: "Gaming PC Custom Build & Tuning",
    category: "Laptop & PC",
    description:
      "Assembly, cable management, BIOS tuning and stress testing for custom gaming PCs.",
    image: "/services/s16.svg", // https://ibb.co/1t0Szpn7
    basePrice: 90,
    estimatedDuration: "1 day",
    serviceMode: "Shop Drop-off",
    serviceArea: "Mirpur, Dhaka",
    technicianEmail: "rafiq@fixmate.dev",
    approvalStatus: "rejected",
    isAvailable: true,
    daysAgo: 10,
  },
];

export const seedServices: Service[] = serviceSeeds.map(
  ({ daysAgo: d, ...rest }) => ({
    ...rest,
    technicianName: tech[rest.technicianEmail as keyof typeof tech],
    createdAt: daysAgo(d),
  }),
);

function booking(
  n: number,
  serviceId: string,
  customerEmail: string,
  status: Booking["status"],
  paid: boolean,
  opts: {
    finalAmount?: number;
    daysAgo: number;
    preferredInDays: number;
    problem: string;
    address: string;
  },
): Booking {
  const svc = seedServices.find((s) => s._id === serviceId)!;
  const cust = seedUsers.find((u) => u.email === customerEmail)!;
  const pref = new Date(NOW + opts.preferredInDays * 86_400_000)
    .toISOString()
    .slice(0, 10);
  return {
    _id: `bk_${String(n).padStart(2, "0")}`,
    serviceId,
    serviceTitle: svc.title,
    serviceImage: svc.image,
    category: svc.category,
    basePrice: svc.basePrice,
    technicianName: svc.technicianName,
    technicianEmail: svc.technicianEmail,
    customerName: cust.name,
    customerEmail: cust.email,
    customerPhone: cust.phone,
    address: opts.address,
    preferredDate: pref,
    problemDescription: opts.problem,
    status,
    finalAmount: opts.finalAmount ?? svc.basePrice,
    paymentStatus: paid ? "paid" : "unpaid",
    createdAt: daysAgo(opts.daysAgo),
  };
}

export const seedBookings: Booking[] = [
  booking(1, "svc_01", "ayesha@fixmate.dev", "completed", true, {
    finalAmount: 92,
    daysAgo: 21,
    preferredInDays: -18,
    problem:
      "Screen cracked after a fall and the touch is unresponsive in the lower third.",
    address: "House 12, Road 4, Banani, Dhaka",
  }),
  booking(2, "svc_05", "ayesha@fixmate.dev", "completed", false, {
    finalAmount: 38,
    daysAgo: 6,
    preferredInDays: -3,
    problem:
      "AC is blowing warm air and dripping water from the indoor unit near the window.",
    address: "House 12, Road 4, Banani, Dhaka",
  }),
  booking(3, "svc_11", "ayesha@fixmate.dev", "in-progress", false, {
    daysAgo: 3,
    preferredInDays: -1,
    problem:
      "Front-load washer stops mid-cycle and shows the E21 drain error code every time.",
    address: "House 12, Road 4, Banani, Dhaka",
  }),
  booking(4, "svc_09", "ayesha@fixmate.dev", "requested", false, {
    daysAgo: 1,
    preferredInDays: 3,
    problem:
      "The 55 inch TV turns on with sound but the picture is almost black unless I shine a torch.",
    address: "House 12, Road 4, Banani, Dhaka",
  }),
  booking(5, "svc_03", "tanvir@fixmate.dev", "accepted", false, {
    daysAgo: 2,
    preferredInDays: 2,
    problem:
      "Gaming laptop gets extremely hot and the fans are loud even while browsing.",
    address: "Flat 5B, Lake Road, Mohammadpur, Dhaka",
  }),
  booking(6, "svc_07", "tanvir@fixmate.dev", "completed", true, {
    finalAmount: 64,
    daysAgo: 14,
    preferredInDays: -10,
    problem:
      "Fridge compartment is warm while the freezer works, and there is ice behind the back panel.",
    address: "Flat 5B, Lake Road, Mohammadpur, Dhaka",
  }),
  booking(7, "svc_13", "tanvir@fixmate.dev", "rejected", false, {
    daysAgo: 8,
    preferredInDays: -5,
    problem:
      "Main breaker trips whenever the geyser and the oven are used together in the evening.",
    address: "Flat 5B, Lake Road, Mohammadpur, Dhaka",
  }),
  booking(8, "svc_02", "sadia@fixmate.dev", "cancelled", false, {
    daysAgo: 5,
    preferredInDays: 1,
    problem:
      "Phone only charges when the cable is held at an angle and then stops after a minute.",
    address: "Block C, Road 9, Bashundhara, Dhaka",
  }),
  booking(9, "svc_06", "sadia@fixmate.dev", "requested", false, {
    daysAgo: 0,
    preferredInDays: 4,
    problem:
      "Inverter AC makes a loud buzzing from the outdoor unit and shuts off after ten minutes.",
    address: "Block C, Road 9, Bashundhara, Dhaka",
  }),
  booking(10, "svc_10", "sadia@fixmate.dev", "completed", true, {
    finalAmount: 25,
    daysAgo: 25,
    preferredInDays: -22,
    problem:
      "Smart TV is stuck on the boot logo and keeps restarting after a failed update.",
    address: "Block C, Road 9, Bashundhara, Dhaka",
  }),
];

export const seedPayments: Payment[] = seedBookings
  .filter((b) => b.paymentStatus === "paid")
  .map((b, i) => ({
    _id: `pay_${String(i + 1).padStart(2, "0")}`,
    bookingId: b._id,
    serviceTitle: b.serviceTitle,
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    technicianName: b.technicianName,
    technicianEmail: b.technicianEmail,
    amount: b.finalAmount,
    currency: "usd" as const,
    transactionId: `pi_3Q${b._id.toUpperCase().replace("_", "")}xT9v${i}kLm`,
    stripeSessionId: `cs_test_a1B2c3D4e5F6${b._id}`,
    paymentStatus: "paid" as const,
    paidAt: new Date(
      new Date(b.createdAt).getTime() + 4 * 86_400_000,
    ).toISOString(),
  }));
