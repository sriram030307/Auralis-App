import { useState } from "react";
import { motion } from "framer-motion";
import { Import, Loader2, Check, AlertCircle } from "lucide-react";

/**
 * Uses the Contact Picker API (navigator.contacts.select) to import contacts
 * from the user's phone address book.
 * Falls back gracefully on devices/browsers that don't support it.
 */
export default function ImportFromPhoneButton({ onImport }) {
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState(0);
  const [error, setError] = useState(null);

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    setImported(0);

    try {
      // Check if Contact Picker API is available
      if (!("contacts" in navigator && "ContactsManager" in window)) {
        throw new Error("NOT_SUPPORTED");
      }

      const props = ["name", "tel", "email"];
      const opts = { multiple: true };

      const deviceContacts = await navigator.contacts.select(props, opts);

      if (!deviceContacts.length) {
        setError("No contacts selected");
        setLoading(false);
        return;
      }

      const mapped = deviceContacts
        .filter(c => c.name?.length && c.tel?.length)
        .map((c, i) => ({
          id: Date.now() + i,
          name: c.name[0] || "Unknown",
          phone: c.tel[0]?.replace(/\s/g, "") || "",
          email: c.email?.[0] || "",
          relationship: "other",
          avatar: "👤",
          isPrimary: false,
        }));

      if (!mapped.length) {
        setError("No contacts with phone numbers found");
        setLoading(false);
        return;
      }

      setImported(mapped.length);
      onImport(mapped);

      setTimeout(() => setImported(0), 3000);
    } catch (e) {
      if (e.message === "NOT_SUPPORTED") {
        setError("Not supported on this device");
      } else {
        setError("Import failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={handleImport}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-[10px] font-semibold text-primary border border-primary/20 transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : imported > 0 ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : error ? (
        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <Import className="w-3.5 h-3.5" />
      )}
      {imported > 0
        ? `Added ${imported}`
        : error
          ? error
          : "Import"}
    </motion.button>
  );
}