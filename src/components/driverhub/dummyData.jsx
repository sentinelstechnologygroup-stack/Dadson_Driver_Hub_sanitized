export const DUMMY_LOADS = {
  active: {
    id: "L-2026-0041",
    status: "active",
    billTo: "Acme Industries",
    bol: "123456",
    po: "98765",
    date: "2026-02-27",
    time: "10:30",
    bolImages: 1,
    driverSig: true,
    receiverSig: false,
    notes: "",
    destination: "1450 Industrial Blvd, Dallas TX",
  },
  incomplete: {
    id: "L-2026-0039",
    status: "incomplete",
    billTo: "Acme Industries",
    bol: "123400",
    po: "98700",
    date: "2026-02-25",
    time: "14:00",
    bolImages: 0,
    driverSig: false,
    receiverSig: false,
    notes: "",
    destination: "820 Commerce St, Houston TX",
    missing: ["BOL Images", "Driver Signature"],
  },
  draft: {
    id: "L-2026-0038",
    status: "draft",
    billTo: "Beta Logistics",
    bol: "",
    po: "",
    date: "2026-02-24",
    time: "",
    bolImages: 0,
    driverSig: false,
    receiverSig: false,
    notes: "",
    destination: "Not set",
  },
};

export const DUMMY_DOCS = [
  { id: "DR-001", type: "receipt", name: "Delivery Receipt – Acme Industries", date: "2026-02-20", size: "124 KB" },
  { id: "DR-002", type: "receipt", name: "Delivery Receipt – Beta Logistics", date: "2026-02-18", size: "98 KB" },
  { id: "DR-003", type: "receipt", name: "Delivery Receipt – Gamma Corp", date: "2026-02-15", size: "110 KB" },
  { id: "BOL-001", type: "bol", name: "BOL Image – #123300", date: "2026-02-20", size: "3.2 MB" },
  { id: "BOL-002", type: "bol", name: "BOL Image – #123200", date: "2026-02-18", size: "2.8 MB" },
];

export const DUMMY_PAYSLIPS = [
  { id: "PS-2026-04", label: "Pay Period: Feb 16–28, 2026", amount: "$3,240.00", date: "2026-02-28", status: "Pending" },
  { id: "PS-2026-03", label: "Pay Period: Feb 1–15, 2026", amount: "$2,980.00", date: "2026-02-15", status: "Paid" },
  { id: "PS-2026-02", label: "Pay Period: Jan 16–31, 2026", amount: "$3,100.00", date: "2026-01-31", status: "Paid" },
  { id: "PS-2026-01", label: "Pay Period: Jan 1–15, 2026", amount: "$2,750.00", date: "2026-01-15", status: "Paid" },
];

export const BILL_TO_OPTIONS = [
  "Acme Industries",
  "Beta Logistics",
  "Gamma Corp",
  "Delta Freight",
  "Omega Supplies",
];