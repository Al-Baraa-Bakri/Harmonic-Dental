import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import emailjs from '@emailjs/browser';
import { Form, FormControl, FormField, FormItem, FormMessage } from "../components/ui/Forms";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Send, FileText, ShoppingCart, Loader2 } from "lucide-react";
import { Textarea } from "../components/ui/Textarea";
import { Input } from "../components/ui/Input";
import { toast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";

// Bot protection configuration
const MIN_FORM_FILL_TIME = 3000; // Minimum 3 seconds to fill form (bots are too fast)
const MAX_SUBMISSIONS_PER_SESSION = 3; // Maximum submissions allowed

// Form validation schema with improved phone validation
const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().min(1, "Phone number is required").refine(
    (value) => isValidPhoneNumber(value || ''),
    "Please enter a valid phone number"
  ),
  country: z.string().min(1, "Country is required"),
  clinic: z.string().trim().max(200, "Clinic name must be less than 200 characters"),
  message: z.string().trim().max(2000, "Message must be less than 2000 characters").optional(),
  _honeypot: z.string().optional(), // Client-side honeypot
});

const emailConfig = {
  serviceId: "service_2s6zplg",
  templateId: "template_ieayfwr",
  templateIdClient: "template_32bxrbk",
  publicKey: "QM4PNfx3gPFub7Shm",
};

type FormData = z.infer<typeof formSchema>;
type TabType = "case" | "order";

interface Country {
  name: { common: string };
  cca2: string;
}

// Memoized tab button component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: typeof FileText;
  label: string;
}

const TabButton = memo(({ active, onClick, icon: Icon, label }: TabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
    }`}
  >
    <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
    <span className="whitespace-nowrap">{label}</span>
  </button>
));
TabButton.displayName = "TabButton";

// Custom hook for fetching countries
const useCountries = () => {
  const [countries, setCountries] = useState<Array<{ name: string; code: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data: Country[] = await response.json();
        const countriesData = data
          .map(country => ({ 
            name: country.name.common, 
            code: country.cca2 
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries');
        setCountries([
          { name: "United Arab Emirates", code: "AE" },
          { name: "United States", code: "US" },
          { name: "United Kingdom", code: "GB" },
          { name: "Canada", code: "CA" },
          { name: "Australia", code: "AU" },
          { name: "Germany", code: "DE" },
          { name: "France", code: "FR" },
          { name: "Spain", code: "ES" },
          { name: "Italy", code: "IT" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  return { countries, isLoading, error };
};

// Bot protection utilities
class BotProtection {
  private static readonly STORAGE_KEY = 'form_submissions';
  private static readonly SESSION_KEY = 'form_session_start';
  
  static initSession(): void {
    if (!sessionStorage.getItem(this.SESSION_KEY)) {
      sessionStorage.setItem(this.SESSION_KEY, Date.now().toString());
    }
  }
  
  static getFormStartTime(): number {
    const startTime = sessionStorage.getItem(this.SESSION_KEY);
    return startTime ? parseInt(startTime, 10) : Date.now();
  }
  
  static validateTiming(): { valid: boolean; reason?: string } {
    const startTime = this.getFormStartTime();
    const elapsed = Date.now() - startTime;
    
    if (elapsed < MIN_FORM_FILL_TIME) {
      return { valid: false, reason: 'Form submitted too quickly. Please try again.' };
    }
    
    return { valid: true };
  }
  
  static checkSubmissionLimit(): { allowed: boolean; count: number } {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const submissions = stored ? JSON.parse(stored) : [];
    
    // Clean up submissions older than 1 hour
    const oneHourAgo = Date.now() - 3600000;
    const recentSubmissions = submissions.filter((time: number) => time > oneHourAgo);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentSubmissions));
    
    return {
      allowed: recentSubmissions.length < MAX_SUBMISSIONS_PER_SESSION,
      count: recentSubmissions.length
    };
  }
  
  static recordSubmission(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const submissions = stored ? JSON.parse(stored) : [];
    submissions.push(Date.now());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(submissions));
  }
  
  static validateContent(text: string): boolean {
    const spamPatterns = [
      /\b(viagra|cialis|pharmacy|casino|lottery)\b/i,
      /\b(click here|buy now|act now|limited time)\b/i,
      /(https?:\/\/){3,}/i, // Multiple URLs
      /\b(crypto|bitcoin|investment opportunity)\b/i,
    ];
    
    return !spamPatterns.some(pattern => pattern.test(text));
  }
  
  static resetSession(): void {
    sessionStorage.setItem(this.SESSION_KEY, Date.now().toString());
  }
}

const InquiryFormSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>("case");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const { countries, isLoading: countriesLoading } = useCountries();

  // Initialize EmailJS
   useEffect(() => {
    emailjs.init(emailConfig.publicKey);
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "United Arab Emirates",
      clinic: "",
      message: "",
      _honeypot: "",
    },
  });

  // Initialize bot protection on mount
  useEffect(() => {
    BotProtection.initSession();
  }, []);

  // Track user interaction to detect bots
  useEffect(() => {
    const handleInteraction = () => setUserInteracted(true);
    
    window.addEventListener('mousemove', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Generate email HTML for company
  const generateCompanyEmailHTML = useCallback((data: FormData, inquiryType: string) => {
    return `
      <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <style>
        /* Base Styles */
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #2b3a44;
          margin: 0;
          padding: 0;
          background-color: #f7f9fa;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Wrapper for email clients */
        .email-wrapper {
          background-color: #f7f9fa;
          padding: 40px 20px;
          width: 100%;
        }
        
        /* Container */
        .container { 
          max-width: 600px; 
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        /* Header */
        .header { 
          background: linear-gradient(135deg, #1a9b6e 0%, #20b87f 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        
        .header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, 
            rgba(255,255,255,0.3) 0%, 
            rgba(255,255,255,0.6) 50%, 
            rgba(255,255,255,0.3) 100%
          );
        }
        
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.25);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          margin-top: 12px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }
        
        /* Content */
        .content {
          padding: 35px 30px;
        }
        
        .field { 
          margin-bottom: 20px;
          padding: 18px;
          background: linear-gradient(135deg, #f8faf9 0%, #f2f7f5 100%);
          border-radius: 8px;
          border-left: 4px solid #1a9b6e;
          transition: all 0.3s ease;
        }
        
        .label { 
          font-weight: 600; 
          color: #1a9b6e;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
          display: block;
        }
        
        .value { 
          color: #2b3a44;
          font-size: 15px;
          line-height: 1.5;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .value a {
          color: #1a9b6e;
          text-decoration: none;
          font-weight: 500;
          word-break: break-all;
        }
        
        /* Footer */
        .footer {
          margin-top: 30px;
          padding: 25px 30px;
          background: linear-gradient(135deg, #f8faf9 0%, #ecf3ef 100%);
          border-top: 2px solid #e8f0ec;
          border-radius: 0 0 12px 12px;
        }
        
        .footer-item {
          display: flex;
          align-items: baseline;
          margin-bottom: 10px;
          font-size: 14px;
          color: #5a6c77;
        }
        
        .footer-label {
          font-weight: 600;
          color: #2b3a44;
          margin-right: 6px;
          min-width: 110px;
        }
        
        .emoji {
          margin-right: 8px;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            #d5e4dc 50%, 
            transparent 100%
          );
          margin: 25px 0;
        }
        
        /* Mobile Responsive Styles */
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          
          .container {
            border-radius: 8px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 22px;
          }
          
          .badge {
            font-size: 12px;
            padding: 5px 12px;
          }
          
          .content {
            padding: 25px 20px;
          }
          
          .field {
            padding: 15px;
            margin-bottom: 15px;
          }
          
          .label {
            font-size: 10px;
          }
          
          .value {
            font-size: 14px;
          }
          
          .footer {
            padding: 20px 20px;
          }
          
          .footer-item {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 15px;
          }
          
          .footer-label {
            min-width: auto;
            margin-bottom: 4px;
          }
          
          .divider {
            margin: 20px 0;
          }
        }
        
        /* Extra small screens */
        @media only screen and (max-width: 400px) {
          .header h1 {
            font-size: 20px;
          }
          
          .content {
            padding: 20px 15px;
          }
          
          .field {
            padding: 12px;
          }
          
          .footer {
            padding: 15px 15px;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #1a1a1a;
          }
          
          .email-wrapper {
            background-color: #1a1a1a;
          }
          
          .container {
            background: #2b2b2b;
          }
          
          .value {
            color: #e0e0e0;
          }
          
          .footer-item {
            color: #b0b0b0;
          }
          
          .footer-label {
            color: #e0e0e0;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <h1>New ${inquiryType} Inquiry</h1>
            <div class="badge">Harmonic DL Contact Form</div>
          </div>
          
          <div class="content">
            <div class="field">
              <span class="label">Full Name</span>
              <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
              <span class="label">Email Address</span>
              <div class="value">
                <a href="mailto:${data.email}">${data.email}</a>
              </div>
            </div>
            
            <div class="field">
              <span class="label">Phone Number</span>
              <div class="value">${data.phone}</div>
            </div>
            
            <div class="field">
              <span class="label">Country</span>
              <div class="value">${data.country}</div>
            </div>
            
            ${data.clinic ? `
            <div class="field">
              <span class="label">Clinic Name</span>
              <div class="value">${data.clinic}</div>
            </div>
            ` : ''}
            
            ${data.message ? `
            <div class="field">
              <span class="label">Message</span>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            
            <div class="divider"></div>
            
            <div class="footer">
              <div class="footer-item">
                <span class="emoji">📅</span>
                <span class="footer-label">Submitted:</span>
                <span>${new Date().toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'short' 
                })}</span>
              </div>
              <div class="footer-item">
                <span class="emoji">📋</span>
                <span class="footer-label">Inquiry Type:</span>
                <span>${inquiryType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
    `;
  }, []);

  // Generate email HTML for client
  const generateClientEmailHTML = useCallback((data: FormData, inquiryType: string) => {
    return `
     <!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
      /* Base Styles */
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6; 
        color: #2b3a44;
        margin: 0;
        padding: 0;
        background-color: #f7f9fa;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Wrapper */
      .email-wrapper {
        background-color: #f7f9fa;
        padding: 40px 20px;
        width: 100%;
      }
      
      /* Container */
      .container { 
        max-width: 600px; 
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      
      /* Header */
      .header { 
        background: linear-gradient(135deg, #1a9b6e 0%, #20b87f 100%);
        color: white;
        padding: 40px 30px;
        text-align: center;
        position: relative;
      }
      
      .header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, 
          rgba(255,255,255,0.3) 0%, 
          rgba(255,255,255,0.6) 50%, 
          rgba(255,255,255,0.3) 100%
        );
      }
      
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      
      .subtitle {
        margin-top: 12px;
        font-size: 16px;
        opacity: 0.95;
        font-weight: 400;
      }
      
      /* Content */
      .content {
        padding: 35px 30px;
      }
      
      .greeting {
        font-size: 18px;
        color: #2b3a44;
        margin-bottom: 20px;
        line-height: 1.6;
      }
      
      .message-box {
        background: linear-gradient(135deg, #f8faf9 0%, #f2f7f5 100%);
        border-left: 4px solid #1a9b6e;
        padding: 20px;
        border-radius: 8px;
        margin: 25px 0;
      }
      
      .message-box p {
        margin: 0 0 12px 0;
        color: #2b3a44;
        line-height: 1.7;
      }
      
      .message-box p:last-child {
        margin-bottom: 0;
      }
      
      .info-section {
        margin: 30px 0;
      }
      
      .info-title {
        font-weight: 600;
        color: #1a9b6e;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        margin-bottom: 15px;
      }
      
      .info-item {
        display: flex;
        align-items: baseline;
        margin-bottom: 8px;
        font-size: 15px;
      }
      
      .info-label {
        font-weight: 600;
        color: #2b3a44;
        margin-right: 8px;
        min-width: 120px;
      }
      
      .info-value {
        color: #5a6c77;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .cta-box {
        background: linear-gradient(135deg, #1a9b6e 0%, #20b87f 100%);
        color: white;
        padding: 25px;
        border-radius: 10px;
        text-align: center;
        margin: 30px 0;
      }
      
      .cta-box h3 {
        margin: 0 0 10px 0;
        font-size: 20px;
        font-weight: 700;
      }
      
      .cta-box p {
        margin: 0;
        font-size: 15px;
        opacity: 0.95;
        line-height: 1.6;
      }
      
      /* Footer */
      .footer {
        margin-top: 30px;
        padding: 25px 30px;
        background: linear-gradient(135deg, #f8faf9 0%, #ecf3ef 100%);
        border-top: 2px solid #e8f0ec;
        text-align: center;
        border-radius: 0 0 12px 12px;
      }
      
      .footer p {
        margin: 8px 0;
        color: #5a6c77;
        font-size: 14px;
        line-height: 1.6;
      }
      
      .footer-contact {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #d5e4dc;
      }
      
      .footer-contact a {
        color: #1a9b6e;
        text-decoration: none;
        font-weight: 500;
        word-break: break-all;
      }
      
      /* Mobile Responsive Styles */
      @media only screen and (max-width: 600px) {
        .email-wrapper {
          padding: 20px 10px;
        }
        
        .container {
          border-radius: 8px;
        }
        
        .header {
          padding: 30px 20px;
        }
        
        .header h1 {
          font-size: 22px;
          line-height: 1.3;
        }
        
        .subtitle {
          font-size: 14px;
          margin-top: 10px;
        }
        
        .content {
          padding: 25px 20px;
        }
        
        .greeting {
          font-size: 16px;
          margin-bottom: 18px;
        }
        
        .message-box {
          padding: 16px;
          margin: 20px 0;
        }
        
        .message-box p {
          font-size: 14px;
          margin: 0 0 10px 0;
        }
        
        .info-section {
          margin: 25px 0;
        }
        
        .info-title {
          font-size: 12px;
          margin-bottom: 12px;
        }
        
        .info-item {
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 12px;
          font-size: 14px;
        }
        
        .info-label {
          min-width: auto;
          margin-bottom: 3px;
        }
        
        .cta-box {
          padding: 20px;
          margin: 25px 0;
        }
        
        .cta-box h3 {
          font-size: 18px;
          margin: 0 0 8px 0;
        }
        
        .cta-box p {
          font-size: 14px;
        }
        
        .footer {
          padding: 20px 20px;
        }
        
        .footer p {
          font-size: 13px;
        }
        
        .footer-contact {
          margin-top: 12px;
          padding-top: 12px;
        }
      }
      
      /* Extra small screens */
      @media only screen and (max-width: 400px) {
        .header h1 {
          font-size: 20px;
        }
        
        .subtitle {
          font-size: 13px;
        }
        
        .content {
          padding: 20px 15px;
        }
        
        .greeting {
          font-size: 15px;
        }
        
        .message-box {
          padding: 14px;
        }
        
        .message-box p {
          font-size: 13px;
        }
        
        .cta-box {
          padding: 18px;
        }
        
        .cta-box h3 {
          font-size: 17px;
        }
        
        .cta-box p {
          font-size: 13px;
        }
        
        .footer {
          padding: 18px 15px;
        }
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #1a1a1a;
        }
        
        .email-wrapper {
          background-color: #1a1a1a;
        }
        
        .container {
          background: #2b2b2b;
        }
        
        .greeting {
          color: #e0e0e0;
        }
        
        .message-box p {
          color: #e0e0e0;
        }
        
        .info-label {
          color: #e0e0e0;
        }
        
        .info-value {
          color: #b0b0b0;
        }
        
        .footer p {
          color: #b0b0b0;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="container">
        <div class="header">
          <h1>Welcome to Harmonic Dental Lab</h1>
          <div class="subtitle">Thank you for reaching out to us!</div>
        </div>
        
        <div class="content">
          <div class="greeting">
            Dear ${data.name},
          </div>
          
          <div class="message-box">
            <p>We are delighted that you've chosen to connect with Harmonic Dental Lab! Your inquiry regarding our ${inquiryType === 'Case Study' ? 'case study services' : 'product offerings'} has been successfully received.</p>
            
            <p>Our dedicated team is reviewing your request and will respond to you within 24 hours during business days. We're committed to providing you with the exceptional service and expertise that Harmonic Dental Lab is known for.</p>
          </div>
          
          <div class="info-section">
            <div class="info-title">Your Submission Details</div>
            <div class="info-item">
              <span class="info-label">Inquiry Type:</span>
              <span class="info-value">${inquiryType}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Submitted on:</span>
              <span class="info-value">${new Date().toLocaleString('en-US', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              })}</span>
            </div>
            ${data.clinic ? `
            <div class="info-item">
              <span class="info-label">Clinic:</span>
              <span class="info-value">${data.clinic}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="cta-box">
            <h3>What Happens Next?</h3>
            <p>Our expert team will carefully review your requirements and reach out to you shortly with detailed information tailored to your needs.</p>
          </div>
          
          <div class="message-box">
            <p><strong>In the meantime, feel free to:</strong></p>
            <p>• Explore our <a href="https://harmonicdl.com" style="color: #1a9b6e; text-decoration: none; font-weight: 500;">website</a> to learn more about our services and products</p>
            <p>• Browse our portfolio of successful case studies</p>
            <p>• Contact us directly if you have any urgent questions</p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing Harmonic Dental Lab</strong></p>
          <p>Where precision meets artistry in dental excellence</p>
          
          <div class="footer-contact">
            <p>Need immediate assistance?</p>
            <p>Website: <a href="https://harmonicdl.com">harmonicdl.com</a></p>
            <p>Email: <a href="mailto:info@harmonicdl.com">info@harmonicdl.com</a></p>
            <p>We look forward to serving you!</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
    `;
  }, []);

  // Form submit handler with EmailJS and bot protection
  const onSubmit = useCallback(async (data: FormData) => {
    try {      
      // 1. Check honeypot
      if (data._honeypot && data._honeypot !== '') {
        console.warn('Bot detected: honeypot filled');
        return;
      }

      // 2. Check user interaction
      if (!userInteracted) {
        toast({
          title: "Error",
          description: "Please interact with the page before submitting.",
          variant: "destructive",
        });
        return;
      }

      // 3. Validate timing
      const timingValidation = BotProtection.validateTiming();
      if (!timingValidation.valid) {
        toast({
          title: "Error",
          description: timingValidation.reason,
          variant: "destructive",
        });
        return;
      }

      // 4. Check submission limit
      const submissionCheck = BotProtection.checkSubmissionLimit();
      if (!submissionCheck.allowed) {
        toast({
          title: "Too Many Submissions",
          description: `You've reached the maximum of ${MAX_SUBMISSIONS_PER_SESSION} submissions per hour. Please try again later.`,
          variant: "destructive",
        });
        return;
      }

      // 5. Validate content for spam
      const contentToCheck = `${data.name} ${data.message || ''} ${data.clinic || ''}`;
      if (!BotProtection.validateContent(contentToCheck)) {
        toast({
          title: "Invalid Content",
          description: "Your message contains prohibited content. Please revise and try again.",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      const inquiryType = activeTab === 'case' ? 'Case Study' : 'Product Order';

      // Send email to company (info@harmonicdl.com)
      const companyEmailParams = {
        to_email: 'info@harmonicdl.com',
        subject: `🔔 New ${inquiryType} from ${data.name}`,
        html: generateCompanyEmailHTML(data, inquiryType),
        from_name: 'Harmonic DL Website',
        reply_to: data.email,
      };

      // Send email to client
      const clientEmailParams = {
        to_email: data.email,
        to_name: data.name,
        subject: 'Thank You for Contacting Harmonic Dental Lab',
        html: generateClientEmailHTML(data, inquiryType),
        from_name: 'Harmonic Dental Lab',
      };

      // Send both emails
      const [companyResult, clientResult] = await Promise.all([
        emailjs.send(
          emailConfig.serviceId,
          emailConfig.templateId,
          companyEmailParams,
          emailConfig.publicKey
        ),
        emailjs.send(
          emailConfig.serviceId,
          emailConfig.templateIdClient,
          clientEmailParams,
          emailConfig.publicKey
        ),
      ]);
      

      if (companyResult.status === 200 && clientResult.status === 200) {
        // Record successful submission
        BotProtection.recordSubmission();
        
        toast({
          title: "Thank You!",
          description: "Your inquiry has been submitted successfully. We'll get back to you soon.",
        });

        // Reset form
        form.reset({
          name: "",
          email: "",
          phone: "",
          country: "United Arab Emirates",
          clinic: "",
          message: "",
          _honeypot: "",
        });

        // Reset session timer for next submission
        BotProtection.resetSession();
        setUserInteracted(false);
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [activeTab, form, userInteracted, generateCompanyEmailHTML, generateClientEmailHTML]);

  const messagePlaceholder = useMemo(
    () => activeTab === "case" ? "Describe your case details..." : "What products are you interested in?",
    [activeTab]
  );

  const submitButtonText = useMemo(
    () => `Submit ${activeTab === "case" ? "Case Study" : "Order"} Request`,
    [activeTab]
  );

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden" aria-labelledby="inquiry-form-heading">
      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-primary/10 rounded-full border border-primary/30">
            <div className="w-2 h-2 bg-primary rounded-full" aria-hidden="true" />
            <span className="text-sm font-semibold text-primary tracking-wider">GET STARTED</span>
          </div>
          <h1 id="inquiry-form-heading" className="text-5xl md:text-6xl font-bold mb-6">
            How Can We Help?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fill out the form below and our team will get back to you shortly.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="relative bg-card border-2 border-border rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-10" role="tablist" aria-label="Inquiry type">
                <TabButton active={activeTab === "case"} onClick={() => handleTabChange("case")} icon={FileText} label="Study a Case" />
                <TabButton active={activeTab === "order"} onClick={() => handleTabChange("order")} icon={ShoppingCart} label="Order Products" />
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  
                  {/* HIDDEN HONEYPOT FIELD */}
                  <FormField
                    control={form.control}
                    name="_honeypot"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} tabIndex={-1} autoComplete="off" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Your Name" autoComplete="name" className="h-14 bg-muted/50 border-border/50 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Your Email" autoComplete="email" className="h-12 sm:h-14 bg-muted/50 border-border/50 rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Enhanced Phone Input with Country Flag */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PhoneInput
                              {...field}
                              international
                              defaultCountry="AE"
                              countryCallingCodeEditable={true}
                              className="phone-input h-12 sm:h-14 bg-muted/50 border border-border/50 rounded-xl px-4 focus-within:ring-2 focus-within:ring-ring"
                              placeholder="Enter phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Country & Clinic */}
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => {
                        const selectedCountry = countries.find(c => c.name === field.value);
                        return (
                          <FormItem>
                            <Select onValueChange={field.onChange} value={field.value} disabled={countriesLoading}>
                              <FormControl>
                                <SelectTrigger className="h-12 sm:h-14 bg-muted/50 border-border/50 rounded-xl">
                                  <SelectValue placeholder={countriesLoading ? "Loading..." : "Select Country"}>
                                    {selectedCountry && (
                                      <div className="flex items-center gap-2">
                                        <img 
                                          src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                                          srcSet={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`}
                                          className="h-3 w-4"
                                          alt={`${selectedCountry.name} flag`}
                                        />
                                        <span>{selectedCountry.name}</span>
                                      </div>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background border-border max-h-60 z-50">
                                {countries.map((country) => (
                                  <SelectItem key={country.name} value={country.name}>
                                    <div className="flex items-center gap-2">
                                      <img 
                                        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                                        width="20"
                                        height="15"
                                        alt={`${country.name} flag`}
                                        className="rounded-sm"
                                      />
                                      <span>{country.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="clinic"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Clinic Name" autoComplete="organization" className="h-12 sm:h-14 bg-muted/50 border-border/50 rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea {...field} placeholder={messagePlaceholder} className="min-h-[120px] bg-muted/50 border-border/50 rounded-xl resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Sending...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Send className="w-5 h-5" /> {submitButtonText}</span>
                    )}
                  </Button>
                </form>
              </Form>

              <p className="text-center text-sm text-muted-foreground mt-8">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InquiryFormSection;