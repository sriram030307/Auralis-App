/**
 * Auralis Notification System
 * Handles push notifications, email alerts, and SW messaging
 */
import { base44 } from "@/api/base44Client";

// Register service worker
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return reg;
  } catch (_) {
    return null;
  }
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

// Show local push notification via Service Worker
export async function showLocalNotification(title, body, options = {}) {
  if (!("serviceWorker" in navigator)) {
    // Fallback: basic notification
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico", ...options });
    }
    return;
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body,
      icon: "/favicon.ico",
      vibrate: options.vibrate || [200, 100, 200],
      requireInteraction: options.requireInteraction || false,
      tag: options.tag || "auralis-info",
      data: { url: options.url || "/" },
    });
  } catch (_) {}
}

// Send message to Service Worker for emergency notification
export async function sendSWEmergencyAlert(message) {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({ type: "AURALIS_EMERGENCY", message });
  } catch (_) {}
}

export async function sendSWAlert(message) {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({ type: "AURALIS_ALERT", message });
  } catch (_) {}
}

// Build rich email HTML for emergency
function buildEmergencyEmail({ userName, locationLink, trigger, timestamp }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:Arial,sans-serif;color:#e2e8f0;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="background:linear-gradient(135deg,#ef4444,#b91c1c);border-radius:16px;padding:28px;text-align:center;margin-bottom:24px;">
      <h1 style="color:white;margin:0 0 8px;font-size:28px;">🚨 EMERGENCY ALERT</h1>
      <p style="color:rgba(255,255,255,0.85);margin:0;font-size:15px;">Auralis AI Guardian System</p>
    </div>

    <div style="background:#1e2433;border-radius:12px;padding:20px;margin-bottom:16px;border:1px solid #2d3748;">
      <h2 style="color:#f87171;margin:0 0 12px;font-size:18px;">⚠️ Immediate Action Required</h2>
      <p style="margin:0 0 8px;color:#cbd5e0;">
        <strong style="color:#e2e8f0;">${userName || "A person"}</strong> may be in danger. 
        Their Auralis safety app has triggered an automatic emergency alert.
      </p>
      <p style="margin:0;color:#a0aec0;font-size:13px;">Trigger: <strong style="color:#fbb6ce;">${trigger}</strong></p>
      <p style="margin:4px 0 0;color:#a0aec0;font-size:13px;">Time: <strong style="color:#e2e8f0;">${timestamp}</strong></p>
    </div>

    <div style="background:#1e2433;border-radius:12px;padding:20px;margin-bottom:16px;border:1px solid #2d3748;">
      <h3 style="color:#60a5fa;margin:0 0 12px;font-size:16px;">📍 Live Location</h3>
      ${locationLink !== "Location unavailable"
        ? `<a href="${locationLink}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:14px;">📍 View on Google Maps</a>
           <p style="margin:8px 0 0;color:#a0aec0;font-size:11px;word-break:break-all;">${locationLink}</p>`
        : `<p style="color:#fbb6ce;margin:0;">Location data unavailable. Please call immediately.</p>`
      }
    </div>

    <div style="background:#1a202c;border-radius:12px;padding:16px;margin-bottom:16px;border:1px solid rgba(239,68,68,0.3);">
      <h3 style="color:#f87171;margin:0 0 8px;font-size:14px;">🆘 Emergency Actions</h3>
      <ul style="margin:0;padding-left:20px;color:#cbd5e0;font-size:13px;line-height:1.8;">
        <li>Call them immediately on their phone</li>
        <li>If unreachable, contact local police: <strong>100</strong></li>
        <li>Ambulance: <strong>108</strong> | Women Helpline: <strong>1091</strong></li>
        <li>Share their location with local authorities</li>
      </ul>
    </div>

    <p style="text-align:center;color:#4a5568;font-size:11px;margin:0;">
      This alert was sent automatically by <strong>Auralis AI Guardian</strong>. 
      Do not reply to this email. If this was a false alarm, please contact the person directly.
    </p>
  </div>
</body>
</html>`;
}

// Send email notifications to emergency contacts
export async function sendEmergencyEmails({ location, trigger, userName }) {
  const locationLink = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
    : "Location unavailable";

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // Get contacts from DB
  let contacts = [];
  try {
    contacts = await base44.entities.EmergencyContact.list();
  } catch (_) {}

  const emailBody = buildEmergencyEmail({ userName, locationLink, trigger, timestamp });
  const subject = `🚨 EMERGENCY: ${userName || "Someone"} needs help — Auralis Alert`;

  // Send to each contact that has an email (phone contacts get in-app notification at minimum)
  const emailPromises = contacts
    .filter(c => c.email)
    .map(c =>
      base44.integrations.Core.SendEmail({
        to: c.email,
        subject,
        body: emailBody,
        from_name: "Auralis Emergency Guardian",
      }).catch(() => {})
    );

  await Promise.allSettled(emailPromises);
  return contacts.length;
}

// Master emergency trigger — call this from anywhere
export async function triggerFullEmergencyAlert({ location, trigger, userName }) {
  const locationLink = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
    : "Location unavailable";

  const message = `🚨 EMERGENCY: ${trigger}. Location: ${locationLink}`;

  // 1. Push notification (shows even if app is backgrounded)
  await sendSWEmergencyAlert(message);

  // 2. Local notification as fallback
  await showLocalNotification("🚨 Emergency Alert Triggered", message, {
    vibrate: [500, 200, 500, 200, 500],
    requireInteraction: true,
    tag: "auralis-emergency",
    url: "/emergency-alert",
  });

  // 3. Email all contacts
  await sendEmergencyEmails({ location, trigger, userName });

  // 4. Log to SafetyAlert DB
  try {
    let contacts = [];
    try { contacts = await base44.entities.EmergencyContact.list(); } catch (_) {}
    await base44.entities.SafetyAlert.create({
      type: "sos",
      status: "active",
      latitude: location?.lat || null,
      longitude: location?.lng || null,
      address: locationLink,
      message,
      contacts_notified: contacts.map(c => c.name),
    });
  } catch (_) {}

  // 5. Auto-record 30s audio evidence
  try {
    if (navigator.mediaDevices?.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const existing = JSON.parse(sessionStorage.getItem("auralis_auto_recordings") || "[]");
        existing.unshift({
          id: Date.now(),
          type: "audio",
          name: `emergency_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, "-")}.webm`,
          size: `${(blob.size / 1024).toFixed(0)} KB`,
          date: new Date().toLocaleString(),
          preview: url,
          auto: true,
          trigger,
        });
        sessionStorage.setItem("auralis_auto_recordings", JSON.stringify(existing.slice(0, 20)));
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setTimeout(() => { if (recorder.state === "recording") recorder.stop(); }, 30000);
    }
  } catch (_) {}
}

// Caution/Elevated risk — lighter alert
export async function triggerRiskAlert({ level, location, userName }) {
  const msg = `⚠️ ${userName || "User"}'s safety risk level is now: ${level}. Location: ${location ? `https://maps.google.com?q=${location.lat},${location.lng}` : "unavailable"}`;
  await sendSWAlert(msg);
  await showLocalNotification(`⚠️ Risk Level: ${level}`, `Auralis has detected elevated risk for ${userName || "you"}.`, {
    tag: "auralis-risk",
    vibrate: [200, 100, 200],
  });
}