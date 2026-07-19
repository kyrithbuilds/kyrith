import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  ArrowLeftRight,
  Receipt,
  Wallet,
  History,
  LayoutDashboard,
  X,
  Check,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const NAVY = "#021D41";
const BLUE = "#4172F4";
const BLUE_HOVER = "#3568E8";
const SECTION_BG = "#F5F8FF";
const BORDER = "#E2E8F0";
const SLATE = "#64748B";
const PARTNER_A = "Karan";
const PARTNER_B = "Tirth";
const CATEGORY_COLORS = {
  Website: "#4172F4",
  Legal: "#0B2A5A",
  Hardware: "#6A92FF",
  Software: "#3568E8",
  Marketing: "#021D41",
  Travel: "#94AEFB",
  Bubble: "#4172F4",
  "Client Project": "#0B2A5A",
  Other: "#94A3B8",
};

const SEED_EXPENSES = [
  { id: "e1", name: "Domain", description: "Purchased Domain from NamesCheap", date: "2026-03-05", amount: 644, category: "Website", paidBy: "Karan" },
  { id: "e2", name: "Hosting", description: "Purchased Hosting from Hoisting.india", date: "2026-03-05", amount: 943, category: "Website", paidBy: "Tirth" },
  { id: "e3", name: "Notary Charges", description: "Charges for notary by Mittal", date: "2026-03-17", amount: 1400, category: "Legal", paidBy: "Tirth" },
  { id: "e4", name: "CA Fees", description: "Fees paid for Deed to Mitul Kanzariya", date: "2026-03-31", amount: 3500, category: "Legal", paidBy: "Tirth" },
  { id: "e5", name: "Headphones", description: "Tirth - Headphones for calls", date: "2026-06-27", amount: 1200, category: "Hardware", paidBy: "Tirth" },
];

const SEED_INCOME = [
  { id: "i1", name: "Aprit", description: "Bubble Payment", date: "2026-03-05", amount: 11200, category: "Bubble", paidTo: "Tirth" },
  { id: "i2", name: "Emmanual", description: "Bubble Payment - Reference Code / Advance Payment", date: "2026-06-22", amount: 9521, category: "Bubble", paidTo: "Karan" },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function formatINR(n) {
  const v = Math.round((n || 0) * 100) / 100;
  const neg = v < 0;
  const abs = Math.abs(v);
  const formatted = abs.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (neg ? "-" : "") + "₹" + formatted;
}

function formatDateShort(iso) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

async function storageGet(key, fallback, shared = true) {
  try {
    const res = await window.storage.get(key, shared);
    if (!res) return fallback;
    return JSON.parse(res.value);
  } catch (e) {
    return fallback;
  }
}
async function storageSet(key, value, shared = true) {
  try {
    await window.storage.set(key, JSON.stringify(value), shared);
    return true;
  } catch (e) {
    return false;
  }
}

function useFinanceData() {
  const [expenses, setExpenses] = useState(null);
  const [income, setIncome] = useState(null);
  const [settlements, setSettlements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [e, i, s] = await Promise.all([
        storageGet("kb-finance:expenses", null),
        storageGet("kb-finance:income", null),
        storageGet("kb-finance:settlements", []),
      ]);
      setExpenses(e === null ? SEED_EXPENSES : e);
      setIncome(i === null ? SEED_INCOME : i);
      setSettlements(s || []);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (key, value) => {
    setSaving(true);
    await storageSet(key, value);
    setSaving(false);
  }, []);

  const addExpense = useCallback(
    (entry) => {
      setExpenses((prev) => {
        const next = [...prev, { ...entry, id: uid() }];
        persist("kb-finance:expenses", next);
        return next;
      });
    },
    [persist]
  );
  const addIncome = useCallback(
    (entry) => {
      setIncome((prev) => {
        const next = [...prev, { ...entry, id: uid() }];
        persist("kb-finance:income", next);
        return next;
      });
    },
    [persist]
  );
  const addSettlement = useCallback(
    (entry) => {
      setSettlements((prev) => {
        const next = [...prev, { ...entry, id: uid() }];
        persist("kb-finance:settlements", next);
        return next;
      });
    },
    [persist]
  );
  const deleteExpense = useCallback(
    (id) => {
      setExpenses((prev) => {
        const next = prev.filter((x) => x.id !== id);
        persist("kb-finance:expenses", next);
        return next;
      });
    },
    [persist]
  );
  const deleteIncome = useCallback(
    (id) => {
      setIncome((prev) => {
        const next = prev.filter((x) => x.id !== id);
        persist("kb-finance:income", next);
        return next;
      });
    },
    [persist]
  );
  const deleteSettlement = useCallback(
    (id) => {
      setSettlements((prev) => {
        const next = prev.filter((x) => x.id !== id);
        persist("kb-finance:settlements", next);
        return next;
      });
    },
    [persist]
  );

  return {
    expenses: expenses || [],
    income: income || [],
    settlements: settlements || [],
    loading,
    saving,
    addExpense,
    addIncome,
    addSettlement,
    deleteExpense,
    deleteIncome,
    deleteSettlement,
  };
}

function computeBalances(income, expenses, settlements) {
  const totalIncome = income.reduce((s, x) => s + Number(x.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, x) => s + Number(x.amount || 0), 0);

  const incomeByPartner = { [PARTNER_A]: 0, [PARTNER_B]: 0 };
  income.forEach((x) => {
    if (incomeByPartner[x.paidTo] !== undefined) incomeByPartner[x.paidTo] += Number(x.amount || 0);
  });
  const expenseByPartner = { [PARTNER_A]: 0, [PARTNER_B]: 0 };
  expenses.forEach((x) => {
    if (expenseByPartner[x.paidBy] !== undefined) expenseByPartner[x.paidBy] += Number(x.amount || 0);
  });

  const fairShareIncome = totalIncome / 2;
  const fairShareExpense = totalExpenses / 2;

  const incomeImbalanceA = incomeByPartner[PARTNER_A] - fairShareIncome; // + means A holds more than fair share
  const expenseImbalanceA = expenseByPartner[PARTNER_A] - fairShareExpense; // + means A overpaid expenses

  let settledAtoB = 0;
  settlements.forEach((s) => {
    if (s.from === PARTNER_A && s.to === PARTNER_B) settledAtoB += Number(s.amount || 0);
    if (s.from === PARTNER_B && s.to === PARTNER_A) settledAtoB -= Number(s.amount || 0);
  });

  const netAtoB = incomeImbalanceA - expenseImbalanceA - settledAtoB;

  return {
    totalIncome,
    totalExpenses,
    incomeByPartner,
    expenseByPartner,
    fairShareIncome,
    fairShareExpense,
    netAtoB,
    settledAtoB,
  };
}

function BalanceBeam({ netAtoB }) {
  const magnitude = Math.min(Math.abs(netAtoB), 20000);
  const pct = magnitude / 20000; // 0..1 how far the marker travels from center
  const direction = netAtoB > 0.5 ? "A" : netAtoB < -0.5 ? "B" : "even";
  const markerPosPct = 50 + (direction === "A" ? pct * 42 : direction === "B" ? -pct * 42 : 0);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          fontWeight: 600,
          color: NAVY,
          marginBottom: 10,
        }}
      >
        <span style={{ opacity: direction === "B" ? 1 : 0.45 }}>{PARTNER_B} is owed</span>
        <span style={{ opacity: direction === "A" ? 1 : 0.45 }}>{PARTNER_A} is owed</span>
      </div>
      <div
        style={{
          position: "relative",
          height: 10,
          borderRadius: 999,
          background: "linear-gradient(90deg, #6A92FF 0%, #E2E8F0 48%, #E2E8F0 52%, #4172F4 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -6,
            bottom: -6,
            width: 2,
            background: BORDER,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -9,
            left: `calc(${markerPosPct}% - 14px)`,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: NAVY,
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(2,29,65,0.35)",
            transition: "left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, tone }) {
  const color = tone === "positive" ? "#0E7A3D" : tone === "negative" ? "#C0392B" : NAVY;
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        padding: "18px 20px",
        flex: 1,
        minWidth: 150,
      }}
    >
      <div style={{ fontSize: 12, color: SLATE, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: SLATE, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 16px",
        borderRadius: 10,
        border: "none",
        background: active ? NAVY : "transparent",
        color: active ? "white" : SLATE,
        fontWeight: 600,
        fontSize: 13.5,
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={15} />
      {children}
    </button>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,29,65,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          width: "100%",
          maxWidth: 440,
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(2,29,65,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 22px",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 16, color: NAVY }}>{title}</div>
          <button
            onClick={onClose}
            style={{ border: "none", background: "none", cursor: "pointer", color: SLATE, padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: NAVY, marginBottom: 6 }}>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 9,
  border: `1px solid ${BORDER}`,
  fontSize: 14,
  fontFamily: "Inter, system-ui, sans-serif",
  color: NAVY,
  outline: "none",
  boxSizing: "border-box",
};

function PrimaryButton({ children, onClick, type = "button", disabled, style }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#9FB4F8" : BLUE,
        color: "white",
        border: "none",
        borderRadius: 10,
        padding: "11px 18px",
        fontWeight: 600,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        width: "100%",
        transition: "background 0.15s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = BLUE_HOVER;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = BLUE;
      }}
    >
      {children}
    </button>
  );
}

function AddEntryModal({ kind, onClose, onSave }) {
  const isExpense = kind === "expense";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(isExpense ? "Website" : "Bubble");
  const [person, setPerson] = useState(PARTNER_A);

  const categories = isExpense
    ? ["Website", "Legal", "Hardware", "Software", "Marketing", "Travel", "Other"]
    : ["Bubble", "Client Project", "Other"];

  const valid = name.trim() && amount && Number(amount) > 0 && date;

  const handleSave = () => {
    if (!valid) return;
    const base = {
      name: name.trim(),
      description: description.trim(),
      date,
      amount: Number(amount),
      category,
    };
    onSave(isExpense ? { ...base, paidBy: person } : { ...base, paidTo: person });
    onClose();
  };

  return (
    <Modal title={isExpense ? "Add expense" : "Add income"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <FieldLabel>Name</FieldLabel>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isExpense ? "e.g. Hosting renewal" : "e.g. Client name"}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <input
            style={inputStyle}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details"
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Date</FieldLabel>
            <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>Amount (INR)</FieldLabel>
            <input
              style={inputStyle}
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Category</FieldLabel>
            <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>{isExpense ? "Paid by" : "Received by"}</FieldLabel>
            <select style={inputStyle} value={person} onChange={(e) => setPerson(e.target.value)}>
              <option value={PARTNER_A}>{PARTNER_A}</option>
              <option value={PARTNER_B}>{PARTNER_B}</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 6 }}>
          <PrimaryButton onClick={handleSave} disabled={!valid}>
            <Plus size={15} />
            Save entry
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}

function SettleModal({ onClose, onSave, netAtoB }) {
  const suggestedFrom = netAtoB > 0 ? PARTNER_A : PARTNER_B;
  const suggestedTo = netAtoB > 0 ? PARTNER_B : PARTNER_A;
  const [from, setFrom] = useState(suggestedFrom);
  const [to, setTo] = useState(suggestedTo);
  const [amount, setAmount] = useState(Math.abs(Math.round(netAtoB * 100) / 100) || "");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const valid = amount && Number(amount) > 0 && from !== to;

  const handleSave = () => {
    if (!valid) return;
    onSave({ from, to, amount: Number(amount), note: note.trim(), date });
    onClose();
  };

  return (
    <Modal title="Log a settlement payment" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            background: SECTION_BG,
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: NAVY,
          }}
        >
          Record it here once money has actually moved between you two — this is what keeps the dashboard balance accurate.
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Paid by</FieldLabel>
            <select style={inputStyle} value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value={PARTNER_A}>{PARTNER_A}</option>
              <option value={PARTNER_B}>{PARTNER_B}</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>Paid to</FieldLabel>
            <select style={inputStyle} value={to} onChange={(e) => setTo(e.target.value)}>
              <option value={PARTNER_A}>{PARTNER_A}</option>
              <option value={PARTNER_B}>{PARTNER_B}</option>
            </select>
          </div>
        </div>
        {from === to && (
          <div style={{ fontSize: 12.5, color: "#C0392B" }}>Paid by and paid to can't be the same person.</div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Date</FieldLabel>
            <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>Amount (INR)</FieldLabel>
            <input
              style={inputStyle}
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Note</FieldLabel>
          <input
            style={inputStyle}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. UPI ref number"
          />
        </div>
        <PrimaryButton onClick={handleSave} disabled={!valid}>
          <Check size={15} />
          Log payment
        </PrimaryButton>
      </div>
    </Modal>
  );
}

function EntryTable({ rows, columns, onDelete, emptyLabel }) {
  if (!rows.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 20px",
          color: SLATE,
          fontSize: 14,
          background: SECTION_BG,
          borderRadius: 12,
        }}
      >
        {emptyLabel}
      </div>
    );
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || "left",
                  padding: "10px 12px",
                  color: SLATE,
                  fontWeight: 600,
                  fontSize: 11.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: `2px solid ${BORDER}`,
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
            <th style={{ width: 36 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "12px", textAlign: c.align || "left", color: NAVY }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() => onDelete(row.id)}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "#CBD5E1", padding: 4 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C0392B")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                  aria-label="Delete entry"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PersonBadge({ name }) {
  const isA = name === PARTNER_A;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        background: isA ? "#EAF0FF" : "#F5F8FF",
        color: isA ? BLUE : NAVY,
        fontWeight: 600,
        fontSize: 12.5,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: isA ? BLUE : NAVY,
        }}
      />
      {name}
    </span>
  );
}

function CategoryChip({ category }) {
  const color = CATEGORY_COLORS[category] || "#94A3B8";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 9px",
        borderRadius: 6,
        background: color + "1A",
        color: color,
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      {category}
    </span>
  );
}

function buildTrendData(income, expenses) {
  const map = {};
  income.forEach((x) => {
    const key = x.date.slice(0, 7);
    if (!map[key]) map[key] = { month: key, income: 0, expenses: 0 };
    map[key].income += Number(x.amount || 0);
  });
  expenses.forEach((x) => {
    const key = x.date.slice(0, 7);
    if (!map[key]) map[key] = { month: key, income: 0, expenses: 0 };
    map[key].expenses += Number(x.amount || 0);
  });
  return Object.values(map).sort((a, b) => (a.month > b.month ? 1 : -1));
}

function buildCategoryData(expenses) {
  const map = {};
  expenses.forEach((x) => {
    map[x.category] = (map[x.category] || 0) + Number(x.amount || 0);
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12.5,
        boxShadow: "0 4px 12px rgba(2,29,65,0.12)",
      }}
    >
      <div style={{ fontWeight: 600, color: NAVY, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{formatINR(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const {
    expenses,
    income,
    settlements,
    loading,
    saving,
    addExpense,
    addIncome,
    addSettlement,
    deleteExpense,
    deleteIncome,
    deleteSettlement,
  } = useFinanceData();

  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState(null);

  const balances = useMemo(() => computeBalances(income, expenses, settlements), [income, expenses, settlements]);
  const trendData = useMemo(() => buildTrendData(income, expenses), [income, expenses]);
  const categoryData = useMemo(() => buildCategoryData(expenses), [expenses]);

  const history = useMemo(() => {
    const items = [
      ...income.map((x) => ({ ...x, type: "income", who: x.paidTo })),
      ...expenses.map((x) => ({ ...x, type: "expense", who: x.paidBy })),
      ...settlements.map((x) => ({ ...x, type: "settlement", who: `${x.from} → ${x.to}` })),
    ];
    return items.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [income, expenses, settlements]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          gap: 12,
          fontFamily: "Inter, system-ui, sans-serif",
          color: SLATE,
        }}
      >
        <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        Loading your finance data…
      </div>
    );
  }

  const balanceSentence =
    Math.abs(balances.netAtoB) < 0.5
      ? "All settled — no balance owed"
      : balances.netAtoB > 0
      ? `${PARTNER_A} owes ${PARTNER_B} ${formatINR(balances.netAtoB)}`
      : `${PARTNER_B} owes ${PARTNER_A} ${formatINR(-balances.netAtoB)}`;

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        background: "white",
        color: NAVY,
        minHeight: 600,
        maxWidth: 980,
        margin: "0 auto",
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${BORDER}`,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      />

      <div
        style={{
          background: NAVY,
          padding: "22px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>
            KyrithBuilds <span style={{ color: "#6A92FF" }}>Finance</span>
          </div>
          <div style={{ color: "#9FB4F8", fontSize: 12.5, marginTop: 2 }}>
            Partner split tracker · {PARTNER_A} & {PARTNER_B}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saving && (
            <span style={{ color: "#9FB4F8", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
              Saving
            </span>
          )}
          <button
            onClick={() => setModal("income")}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 9,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={14} />
            Income
          </button>
          <button
            onClick={() => setModal("expense")}
            style={{
              background: BLUE,
              color: "white",
              border: "none",
              borderRadius: 9,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={14} />
            Expense
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "14px 20px",
          borderBottom: `1px solid ${BORDER}`,
          overflowX: "auto",
        }}
      >
        <TabButton active={tab === "dashboard"} onClick={() => setTab("dashboard")} icon={LayoutDashboard}>
          Dashboard
        </TabButton>
        <TabButton active={tab === "income"} onClick={() => setTab("income")} icon={Wallet}>
          Income
        </TabButton>
        <TabButton active={tab === "expenses"} onClick={() => setTab("expenses")} icon={Receipt}>
          Expenses
        </TabButton>
        <TabButton active={tab === "history"} onClick={() => setTab("history")} icon={History}>
          History
        </TabButton>
      </div>

      <div style={{ padding: 24 }}>
        {tab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                background: SECTION_BG,
                borderRadius: 16,
                padding: "26px 28px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12.5, color: SLATE, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Current balance
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: Math.abs(balances.netAtoB) < 0.5 ? SLATE : balances.netAtoB > 0 ? BLUE : NAVY, marginBottom: 18 }}>
                {balanceSentence}
              </div>
              <div style={{ maxWidth: 420, margin: "0 auto" }}>
                <BalanceBeam netAtoB={balances.netAtoB} />
              </div>
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => setModal("settle")}
                  style={{
                    background: "white",
                    border: `1px solid ${BORDER}`,
                    color: NAVY,
                    borderRadius: 10,
                    padding: "9px 18px",
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <ArrowLeftRight size={14} />
                  Log a settlement payment
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <MetricCard label="Total income" value={formatINR(balances.totalIncome)} sub={`${income.length} entries`} />
              <MetricCard label="Total expenses" value={formatINR(balances.totalExpenses)} sub={`${expenses.length} entries`} />
              <MetricCard
                label={`${PARTNER_A} received`}
                value={formatINR(balances.incomeByPartner[PARTNER_A])}
                sub={`Fair share: ${formatINR(balances.fairShareIncome)}`}
              />
              <MetricCard
                label={`${PARTNER_B} received`}
                value={formatINR(balances.incomeByPartner[PARTNER_B])}
                sub={`Fair share: ${formatINR(balances.fairShareIncome)}`}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: 16,
              }}
              className="kb-grid"
            >
              <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Income vs expenses</div>
                <div style={{ fontSize: 12.5, color: SLATE, marginBottom: 8 }}>By month</div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, marginBottom: 4 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: BLUE }} /> Income
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: "#CBD5E1" }} /> Expenses
                  </span>
                </div>
                <div style={{ height: 220 }}>
                  {trendData.length === 0 ? (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: SLATE, fontSize: 13 }}>
                      No data yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <defs>
                          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: SLATE }} axisLine={{ stroke: BORDER }} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: SLATE }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="income" name="Income" stroke={BLUE} fill="url(#incomeGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#94A3B8" fill="transparent" strokeWidth={2} strokeDasharray="4 3" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Expenses by category</div>
                <div style={{ fontSize: 12.5, color: SLATE, marginBottom: 8 }}>All time</div>
                <div style={{ height: 220 }}>
                  {categoryData.length === 0 ? (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: SLATE, fontSize: 13 }}>
                      No expenses yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {categoryData.map((entry, i) => (
                            <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#94A3B8"} stroke="white" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {categoryData.map((c) => (
                    <span key={c.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: SLATE }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[c.name] || "#94A3B8" }} />
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "income" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Income</div>
                <div style={{ fontSize: 12.5, color: SLATE }}>Every payment received, by either partner</div>
              </div>
              <PrimaryButton onClick={() => setModal("income")} style={{ width: "auto" }}>
                <Plus size={14} /> Add income
              </PrimaryButton>
            </div>
            <EntryTable
              rows={income.slice().sort((a, b) => (a.date < b.date ? 1 : -1))}
              emptyLabel="No income logged yet. Add your first entry."
              onDelete={deleteIncome}
              columns={[
                { key: "name", label: "Name" },
                { key: "description", label: "Description" },
                { key: "date", label: "Date", render: (r) => formatDateShort(r.date) },
                { key: "amount", label: "Amount", align: "right", render: (r) => formatINR(r.amount) },
                { key: "category", label: "Category", render: (r) => <CategoryChip category={r.category} /> },
                { key: "paidTo", label: "Received by", render: (r) => <PersonBadge name={r.paidTo} /> },
              ]}
            />
          </div>
        )}

        {tab === "expenses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Expenses</div>
                <div style={{ fontSize: 12.5, color: SLATE }}>Every cost paid, by either partner</div>
              </div>
              <PrimaryButton onClick={() => setModal("expense")} style={{ width: "auto" }}>
                <Plus size={14} /> Add expense
              </PrimaryButton>
            </div>
            <EntryTable
              rows={expenses.slice().sort((a, b) => (a.date < b.date ? 1 : -1))}
              emptyLabel="No expenses logged yet. Add your first entry."
              onDelete={deleteExpense}
              columns={[
                { key: "name", label: "Name" },
                { key: "description", label: "Description" },
                { key: "date", label: "Date", render: (r) => formatDateShort(r.date) },
                { key: "amount", label: "Amount", align: "right", render: (r) => formatINR(r.amount) },
                { key: "category", label: "Category", render: (r) => <CategoryChip category={r.category} /> },
                { key: "paidBy", label: "Paid by", render: (r) => <PersonBadge name={r.paidBy} /> },
              ]}
            />
          </div>
        )}

        {tab === "history" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>History</div>
              <div style={{ fontSize: 12.5, color: SLATE }}>Full timeline — income, expenses, and settlements together</div>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", color: SLATE, fontSize: 14, background: SECTION_BG, borderRadius: 12 }}>
                Nothing logged yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {history.map((item) => {
                  const isIncome = item.type === "income";
                  const isSettlement = item.type === "settlement";
                  const Icon = isSettlement ? ArrowRight : isIncome ? TrendingUp : TrendingDown;
                  const color = isSettlement ? "#0E7A3D" : isIncome ? BLUE : "#C0392B";
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 6px",
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: color + "16",
                          color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: NAVY }}>
                          {isSettlement ? "Settlement payment" : item.name}
                          {item.description && !isSettlement && (
                            <span style={{ color: SLATE, fontWeight: 400 }}> — {item.description}</span>
                          )}
                          {isSettlement && item.note && (
                            <span style={{ color: SLATE, fontWeight: 400 }}> — {item.note}</span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: SLATE, marginTop: 2 }}>
                          {formatDateShort(item.date)} · {item.who}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14, color, whiteSpace: "nowrap" }}>
                        {isSettlement ? "" : isIncome ? "+" : "-"}
                        {formatINR(item.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {modal === "income" && (
        <AddEntryModal kind="income" onClose={() => setModal(null)} onSave={addIncome} />
      )}
      {modal === "expense" && (
        <AddEntryModal kind="expense" onClose={() => setModal(null)} onSave={addExpense} />
      )}
      {modal === "settle" && (
        <SettleModal onClose={() => setModal(null)} onSave={addSettlement} netAtoB={balances.netAtoB} />
      )}

      <style>{`
        @media (max-width: 680px) {
          .kb-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
