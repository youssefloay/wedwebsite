import React, { useState, useEffect } from 'react';
import { RsvpData, updateRsvp } from '../../../lib/rsvpService';
import { sendCastilloRoomPaymentEmail, EMAILJS_PAYMENT_TEMPLATE_ID } from '../../../lib/emailService';
import { CASTILLO_STEP1_IMAGE_URL, CASTILLO_STEP2_IMAGE_URL } from './castilloEmailImages';
import { X, Mail, Check, AlertCircle, Eye, Send, CheckSquare, Square, Copy, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  allRsvps: RsvpData[];
  onClose: () => void;
  onRefresh: () => void;
}

export const CastilloPaymentEmailModal: React.FC<Props> = ({ allRsvps, onClose, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'recipients' | 'preview'>('recipients');
  
  // Filter for room guests (excluding placeholders and declined)
  const roomGuests = allRsvps.filter(r => {
    const isPlaceholder = r.isPlaceholder || r.email?.includes('placeholder-') || r.notes === "Placeholder created by admin.";
    const isAttending = r.attendance === "Joyfully accept";
    const hasRoom = r.accommodation === "Yes, please" || !!r.roomPreference || !!r.assignedRoom;
    return !isPlaceholder && isAttending && hasRoom && !!r.email;
  });

  // Selected guest IDs (all selected by default)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState<{ current: number; total: number; name: string } | null>(null);

  // Separate Template ID state (independent from confirmation email template)
  const [emailjsTemplateId, setEmailjsTemplateId] = useState<string>(EMAILJS_PAYMENT_TEMPLATE_ID);
  const [showTemplateConfig, setShowTemplateConfig] = useState(false);

  // Test email state
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('Lama');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'error';
    email: string;
    message: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    const initialSelected = roomGuests.map(g => g.id!).filter(Boolean);
    setSelectedIds(initialSelected);
  }, [allRsvps]);

  const toggleSelectAll = () => {
    if (selectedIds.length === roomGuests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(roomGuests.map(g => g.id!).filter(Boolean));
    }
  };

  const toggleGuest = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleSendTestEmail = async () => {
    const trimmed = testEmail.trim();
    if (!trimmed || !trimmed.includes('@')) {
      toast.error("Please enter a valid email address to test.");
      return;
    }

    setIsSendingTest(true);
    setTestResult(null);

    const res = await sendCastilloRoomPaymentEmail({
      firstName: testName.trim() || 'Guest',
      email: trimmed,
    }, emailjsTemplateId.trim());
    setIsSendingTest(false);

    const timeStr = new Date().toLocaleTimeString();
    if (res.success) {
      setTestResult({
        status: 'success',
        email: trimmed,
        message: `EmailJS responded OK (200)! Sent to ${trimmed} using template: ${emailjsTemplateId.trim()}.`,
        timestamp: timeStr,
      });
      toast.success(`Test email sent to ${trimmed}! Please check your Inbox and Spam/Junk folder.`);
    } else {
      setTestResult({
        status: 'error',
        email: trimmed,
        message: `EmailJS error: ${res.error || 'Request rejected.'}`,
        timestamp: timeStr,
      });
      toast.error(`Failed to send test email: ${res.error || 'Check console'}`);
    }
  };

  const handleSendEmails = async () => {
    const targets = roomGuests.filter(g => g.id && selectedIds.includes(g.id));
    if (targets.length === 0) {
      toast.error("Please select at least one guest to email");
      return;
    }

    if (!confirm(`Are you sure you want to send the Castillo Payment Guide email to ${targets.length} guest(s)?`)) {
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let failCount = 0;
    let lastError = '';

    for (let i = 0; i < targets.length; i++) {
      const guest = targets[i];
      setSendingProgress({ current: i + 1, total: targets.length, name: `${guest.firstName} ${guest.lastName}` });

      const res = await sendCastilloRoomPaymentEmail(guest, emailjsTemplateId.trim());
      if (res.success) {
        successCount++;
        if (guest.id) {
          try {
            await updateRsvp(guest.id, { roomPaymentEmailSent: true });
          } catch (e) {
            console.error("Failed to update status for", guest.id);
          }
        }
      } else {
        failCount++;
        lastError = res.error || 'Unknown error';
        console.error(`Failed sending to ${guest.email}:`, res.error);
      }

      // Small delay between email calls to prevent rate limiting
      await new Promise(res => setTimeout(res, 400));
    }

    setIsSending(false);
    setSendingProgress(null);

    if (successCount > 0) {
      toast.success(`Successfully sent ${successCount} room payment email(s)! If guests don't see it, remind them to check Spam/Junk.`);
      onRefresh();
    }
    if (failCount > 0) {
      toast.error(`Failed to send ${failCount} email(s): ${lastError}`);
    }

    if (failCount === 0) {
      onClose();
    }
  };

  const handleCopyText = () => {
    const text = `Subject: Action Required: Castillo de Monda Room Payment (Due Nov 13)\n\nHi everyone,\n\nWe hope you are getting excited for our wedding! If you haven't paid yet or are struggling to understand how to pay, here is a quick guide regarding your room reservation at Castillo de Monda:\n\nStep by Step Payment Guide:\n1. Open the Booking Confirmation email sent to you by Castillo de Monda.\n2. Click the link that says "here" in the line "visiting the hotel's services portal here".\n3. Scroll down on the portal page and click "Check your bill".\n4. Complete your payment process online before November 13th.\n\nWarmly,\nLama & Álvaro`;
    navigator.clipboard.writeText(text);
    toast.success("Email text copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-accent-terracotta/20 my-8">
        
        {/* Header */}
        <div className="p-6 bg-[#FAF8F5] border-b border-accent-terracotta/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-terracotta/10 flex items-center justify-center text-accent-terracotta">
              <Mail size={22} />
            </div>
            <div>
              <h3 className="font-serif italic text-2xl text-primary-text">Send Castillo Room Payment Email</h3>
              <p className="text-xs text-secondary-text opacity-70">Guide room guests with step by step payment screenshots (Deadline: Nov 13)</p>
            </div>
          </div>
          <button 
            disabled={isSending}
            onClick={onClose}
            className="p-2 text-secondary-text hover:text-primary-text hover:bg-black/5 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Test Email Bar */}
        <div className="bg-[#FFFDFB] px-6 py-3 border-b border-accent-terracotta/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-secondary-text">
            <span className="font-serif italic text-accent-terracotta font-semibold">Test delivery to your inbox:</span>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Guest Name (e.g. Lama)"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-accent-terracotta/20 text-xs w-28 focus:outline-none focus:border-accent-terracotta bg-white"
              title="Guest first name for the email greeting"
            />
            <input
              type="email"
              placeholder="Enter your email..."
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-accent-terracotta/20 text-xs flex-1 focus:outline-none focus:border-accent-terracotta bg-white"
            />
            <button
              onClick={handleSendTestEmail}
              disabled={isSendingTest || !testEmail}
              className="px-4 py-1.5 rounded-xl bg-accent-terracotta text-white font-serif italic whitespace-nowrap hover:bg-accent-terracotta/90 disabled:opacity-50 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Send size={12} />
              {isSendingTest ? 'Sending...' : 'Send Test Email'}
            </button>
          </div>
        </div>

        {/* Template Settings / Notice */}
        <div className="bg-[#FAF8F5] px-6 py-2 border-b border-accent-terracotta/10 flex items-center justify-between text-xs text-secondary-text">
          <div className="flex items-center gap-2">
            <span className="font-bold text-accent-terracotta">EmailJS Template:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-accent-terracotta/20 text-[11px]">{emailjsTemplateId}</span>
            <span className="text-[10px] text-gray-500 italic">(Separate from RSVP Confirmation: template_hvorhqr)</span>
          </div>
          <button
            onClick={() => setShowTemplateConfig(!showTemplateConfig)}
            className="flex items-center gap-1 text-accent-terracotta hover:underline font-serif italic text-[11px]"
          >
            <Settings size={12} /> {showTemplateConfig ? 'Hide Config' : 'Change Template ID'}
          </button>
        </div>

        {showTemplateConfig && (
          <div className="bg-amber-50/70 p-4 border-b border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2">
              <label className="font-bold">EmailJS Template ID for Payment Guide:</label>
              <input
                type="text"
                value={emailjsTemplateId}
                onChange={(e) => setEmailjsTemplateId(e.target.value)}
                placeholder="template_paymentlink"
                className="px-2.5 py-1 rounded-lg border border-amber-300 font-mono text-xs bg-white w-56 focus:outline-none focus:border-accent-terracotta"
              />
            </div>
            <p className="text-[11px] opacity-80">
              💡 Separate from your RSVP confirmation template (<strong>template_hvorhqr</strong>). Configured for <strong>template_paymentlink</strong> in <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener noreferrer" className="underline font-bold">EmailJS Dashboard</a> with Subject: <em>Lama &amp; Álvaro&rsquo;s Wedding — Castillo de Monda Room &amp; Payment Guide</em> and content containing <em>{"{{{payment_html}}}"}</em>.
            </p>
          </div>
        )}

        {/* Test Result Diagnostic Banner */}
        {testResult && (
          <div className={`px-6 py-3 border-b text-xs ${
            testResult.status === 'success' 
              ? 'bg-green-50/80 border-green-200 text-green-900' 
              : 'bg-red-50/90 border-red-300 text-red-900'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${testResult.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">[{testResult.timestamp}]</span>
                    <span className="font-medium">{testResult.message}</span>
                  </div>
                  {testResult.status === 'error' && (testResult.message.includes('Outlook') || testResult.message.includes('suspended') || testResult.message.includes('WASCL')) && (
                    <div className="mt-2 p-2.5 bg-white/80 rounded-lg border border-red-200 text-[11px] text-red-950 space-y-1">
                      <p className="font-bold text-red-700">⚠️ Microsoft Outlook Action Required:</p>
                      <p>
                        Microsoft has flagged the Outlook account connected to EmailJS (<code>service_am48iun</code>) for outgoing security verification.
                      </p>
                      <ul className="list-disc ml-4 space-y-0.5">
                        <li>Log in to your Outlook inbox at <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-red-800">outlook.live.com</a> and complete the security/unblock prompt.</li>
                        <li>Then visit <a href="https://dashboard.emailjs.com/admin/services" target="_blank" rel="noopener noreferrer" className="underline font-bold text-red-800">EmailJS Dashboard &rarr; Email Services</a>, open <code>service_am48iun</code>, and click <strong>Reconnect Account</strong>.</li>
                      </ul>
                    </div>
                  )}
                  {testResult.status === 'error' && testResult.message.includes('Variables size limit') && (
                    <div className="mt-2 p-2 bg-white/80 rounded border border-red-200 text-[11px] text-red-900">
                      💡 Payload size exceeded 50Kb. The image screenshots have now been compressed under 20Kb to ensure delivery.
                    </div>
                  )}
                </div>
              </div>
              <a 
                href="https://dashboard.emailjs.com/admin/history" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-serif italic opacity-80 hover:opacity-100 shrink-0 text-[11px]"
              >
                Delivery Logs &rarr;
              </a>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-accent-terracotta/10 bg-white">
          <button
            onClick={() => setActiveTab('recipients')}
            className={`flex-1 py-3.5 px-6 text-sm font-serif italic flex items-center justify-center gap-2 transition-all ${
              activeTab === 'recipients'
                ? 'border-b-2 border-accent-terracotta text-accent-terracotta font-bold bg-accent-terracotta/5'
                : 'text-secondary-text hover:bg-black/5'
            }`}
          >
            <Mail size={16} />
            Select Recipients ({selectedIds.length} / {roomGuests.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3.5 px-6 text-sm font-serif italic flex items-center justify-center gap-2 transition-all ${
              activeTab === 'preview'
                ? 'border-b-2 border-accent-terracotta text-accent-terracotta font-bold bg-accent-terracotta/5'
                : 'text-secondary-text hover:bg-black/5'
            }`}
          >
            <Eye size={16} />
            Email & Screenshots Preview
          </button>
        </div>

        {/* Tab 1: Recipients List */}
        {activeTab === 'recipients' && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between bg-black/5 p-3 rounded-2xl text-xs">
              <button 
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-accent-terracotta font-medium hover:underline"
              >
                {selectedIds.length === roomGuests.length ? <CheckSquare size={16} /> : <Square size={16} />}
                {selectedIds.length === roomGuests.length ? 'Deselect All' : 'Select All Guests'}
              </button>
              <div className="text-secondary-text">
                <span className="font-bold text-accent-terracotta">{selectedIds.length}</span> of {roomGuests.length} guests selected
                {roomGuests.length - selectedIds.length > 0 && (
                  <span className="ml-2 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    ({roomGuests.length - selectedIds.length} excluded)
                  </span>
                )}
              </div>
            </div>

            {/* Notice Callout */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">Uncheck the 2 guests you wish to exclude:</p>
                <p className="opacity-90">All room guests are checked by default. Uncheck any guests who should not receive this payment reminder before clicking Send.</p>
              </div>
            </div>

            {/* Guests List */}
            <div className="divide-y divide-accent-terracotta/10 border border-accent-terracotta/10 rounded-2xl overflow-hidden bg-white">
              {roomGuests.length === 0 ? (
                <p className="p-8 text-center text-secondary-text italic">No attending guests with room preferences found.</p>
              ) : (
                roomGuests.map(guest => {
                  const isChecked = selectedIds.includes(guest.id!);
                  return (
                    <label 
                      key={guest.id}
                      className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-accent-terracotta/5 ${
                        isChecked ? 'bg-white' : 'bg-gray-50/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleGuest(guest.id!)}
                          className="w-4 h-4 accent-[#B3724C] rounded cursor-pointer"
                        />
                        <div>
                          <p className="font-serif italic font-medium text-primary-text">
                            {guest.firstName} {guest.lastName}
                          </p>
                          <p className="text-xs text-secondary-text opacity-70">{guest.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {guest.roomPreference && (
                          <span className="text-[10px] bg-[#FAF8F5] border border-accent-terracotta/20 px-2.5 py-1 rounded-lg text-accent-terracotta font-serif italic">
                            {guest.roomPreference}
                          </span>
                        )}
                        {guest.roomPaymentEmailSent && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-green-200">
                            <Check size={10} /> Email Sent
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Preview Email */}
        {activeTab === 'preview' && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-[#FAF8F5]">
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-accent-terracotta/10 text-xs">
              <span className="font-bold text-accent-terracotta uppercase tracking-wider">Email Subject:</span>
              <span className="text-primary-text font-serif italic">Lama & Álvaro's Wedding — Castillo de Monda Room & Payment Guide</span>
              <button 
                onClick={handleCopyText}
                className="flex items-center gap-1 text-accent-terracotta hover:underline font-serif italic"
              >
                <Copy size={12} /> Copy Text
              </button>
            </div>

            {/* Live HTML Email Preview */}
            <div className="bg-white p-6 rounded-2xl border border-accent-terracotta/15 shadow-sm text-secondary-text font-serif space-y-4">
              
              <div className="text-center pb-4 border-b border-accent-terracotta/10 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-secondary-text opacity-75">Lama & Álvaro's Wedding</p>
                <h4 className="text-2xl font-serif italic text-accent-terracotta">Castillo de Monda</h4>
                <p className="text-xs font-serif italic text-secondary-text">Room Accommodation & Payment Guide</p>
              </div>

              <p className="text-base italic">Dear [Guest Name],</p>
              <p className="text-sm leading-relaxed">
                We hope you are getting excited for our wedding! If you haven't paid yet or are struggling to understand how to pay, we are sending you this quick guide regarding your room reservation at <strong>Castillo de Monda</strong>.
              </p>

              {/* Callout Box */}
              <div className="bg-[#FFF8F6] border-l-4 border-accent-terracotta p-4 rounded-xl space-y-1">
                <p className="text-sm font-bold text-accent-terracotta">⏰ Important Deadline: Pay Before November 13th</p>
                <p className="text-xs text-secondary-text">The hotel requires guests to settle room payments directly through their online guest portal before November 13th.</p>
              </div>

              <h5 className="text-lg font-serif italic text-accent-terracotta border-b border-accent-terracotta/10 pb-2 pt-2">
                Step by Step Payment Guide
              </h5>

              {/* Step 1 Preview */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-primary-text">Step 1: Open your Hotel Confirmation Email</p>
                <p className="text-xs leading-relaxed text-secondary-text">
                  Find the booking confirmation email sent directly by Castillo de Monda. Click on the red <u className="text-accent-terracotta font-bold">here</u> link in <em>"pre check in by visiting the hotel's services portal <u>here</u>"</em>.
                </p>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-accent-terracotta/10 text-center">
                  <img 
                    src={CASTILLO_STEP1_IMAGE_URL} 
                    alt="Step 1 Guide" 
                    className="max-h-60 mx-auto rounded-lg border border-accent-terracotta/20 shadow-sm"
                  />
                  <p className="text-[10px] italic text-secondary-text mt-2 opacity-70">Screenshot: Click on the "here" link in the hotel email</p>
                </div>
              </div>

              {/* Step 2 Preview */}
              <div className="space-y-2 pt-2">
                <p className="text-sm font-bold text-primary-text">Step 2: Scroll down on the portal & Click "Check your bill"</p>
                <p className="text-xs leading-relaxed text-secondary-text">
                  Once redirected to the portal (<em>"Welcome to the Castillo!"</em>), scroll down and click <strong>"Check your bill"</strong> to pay online.
                </p>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-accent-terracotta/10 text-center">
                  <img 
                    src={CASTILLO_STEP2_IMAGE_URL} 
                    alt="Step 2 Guide" 
                    className="max-h-60 mx-auto rounded-lg border border-accent-terracotta/20 shadow-sm"
                  />
                  <p className="text-[10px] italic text-secondary-text mt-2 opacity-70">Screenshot: Scroll down on portal & click "Check your bill"</p>
                </div>
              </div>

              <p className="text-sm pt-4 border-t border-accent-terracotta/10 font-serif italic text-accent-terracotta">
                Can't wait to celebrate with you! 🎉<br/>
                <strong>Lama & Álvaro</strong>
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer / Actions */}
        <div className="p-6 bg-[#FAF8F5] border-t border-accent-terracotta/10 flex items-center justify-between">
          <button
            disabled={isSending}
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-accent-terracotta/20 text-secondary-text hover:bg-black/5 text-sm font-serif italic transition-all"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {isSending && sendingProgress && (
              <div className="flex items-center gap-2 text-xs text-accent-terracotta font-serif italic bg-accent-terracotta/10 px-4 py-2 rounded-full animate-pulse">
                <span>Sending email {sendingProgress.current} of {sendingProgress.total} to {sendingProgress.name}...</span>
              </div>
            )}

            <button
              onClick={handleSendEmails}
              disabled={isSending || selectedIds.length === 0}
              className="px-8 py-3 rounded-full bg-accent-terracotta text-white font-serif italic text-sm shadow-md hover:bg-accent-terracotta/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={16} />
              {isSending ? 'Sending...' : `Send to ${selectedIds.length} Guest(s)`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
