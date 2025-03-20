// API handler for contact form submissions with Turnstile verification
export const submitContactForm = async (
  email: string,
  subject: string,
  message: string,
  turnstileToken: NonNullable<string>
) => {
  try {
    // First, verify the turnstile token
    const turnstileResponse = await verifyTurnstileToken(turnstileToken);
    
    if (!turnstileResponse.success) {
      throw new Error('Turnstile verification failed');
    }
    
    // In a real app, you would send the email via an API service like SendGrid, AWS SES, etc.
    // For demonstration, we'll simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true };
  } catch (error) {
    console.error('Error sending contact form:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Verify Turnstile token with Cloudflare
async function verifyTurnstileToken(token: string) {
  const secretKey = import.meta.env.VITE_TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('Turnstile secret key not found in environment variables');
    throw new Error('Turnstile configuration error');
  }
  
  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  return await response.json();
}
