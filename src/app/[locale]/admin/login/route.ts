import { NextRequest, NextResponse } from 'next/server';

// Forza questa route ad essere dinamica
export const dynamic = 'force-dynamic';

// Questa route risponde alle richieste GET per /[locale]/admin/login
// Bypassando completamente il middleware
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale } = await context.params;
  const loginHTML = `
  <!DOCTYPE html>
  <html lang="${locale}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login MTRE Admin</title>
    <style>
      /* Stili di base */
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: linear-gradient(to bottom, #f9fafb, #ffffff);
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .container {
        max-width: 400px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      .header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .header h1 {
        font-size: 1.875rem;
        font-weight: 800;
        color: #111827;
        margin-bottom: 0.5rem;
      }
      .header p {
        font-size: 0.875rem;
        color: #6b7280;
      }
      .card {
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
        padding: 1.5rem;
        border: 1px solid #f3f4f6;
      }
      .form-group {
        margin-bottom: 1.5rem;
      }
      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.5rem;
      }
      input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        font-size: 0.875rem;
      }
      button {
        width: 100%;
        background-color: #4f46e5;
        color: white;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.875rem;
        transition: background-color 0.2s;
      }
      button:hover {
        background-color: #4338ca;
      }
      button:disabled {
        background-color: #6366f1;
        cursor: not-allowed;
      }
      .error {
        background-color: #fee2e2;
        border-radius: 0.375rem;
        padding: 1rem;
        margin-bottom: 1.5rem;
        display: flex;
      }
      .error-icon {
        flex-shrink: 0;
        color: #ef4444;
        margin-right: 0.75rem;
      }
      .error-message {
        color: #b91c1c;
        font-size: 0.875rem;
      }
      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>M.T.R.E. Admin</h1>
        <p>Accedi all'area amministrativa</p>
      </div>

      <div class="card">
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              placeholder="nome@esempio.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>

          <div id="errorContainer" class="error hidden">
            <div class="error-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div id="errorMessage" class="error-message"></div>
          </div>

          <button type="submit" id="submitButton">
            <span id="loadingIcon" class="hidden">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="animation: spin 1s linear infinite; margin-right: 0.5rem;">
                <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span id="buttonText">Accedi</span>
          </button>
        </form>
      </div>
    </div>

    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        const submitButton = document.getElementById('submitButton');
        const buttonText = document.getElementById('buttonText');
        const loadingIcon = document.getElementById('loadingIcon');
        const errorContainer = document.getElementById('errorContainer');
        const errorMessage = document.getElementById('errorMessage');
        
        // Ottieni i parametri dell'URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirectTo');
        
        console.log('Login page loaded via route handler', { 
          locale: '${locale}',
          redirectTo: redirectTo,
          url: window.location.href,
          pathname: window.location.pathname
        });

        loginForm.addEventListener('submit', async function(e) {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          // Mostra lo stato di caricamento
          submitButton.disabled = true;
          buttonText.textContent = 'Accesso in corso...';
          loadingIcon.classList.remove('hidden');
          errorContainer.classList.add('hidden');
          
          console.log('Login attempt', { email, redirectTo });
          
          try {
            // Costruisce i dati di login
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            if (redirectTo) {
              formData.append('redirectTo', redirectTo);
            }

            // Effettua la chiamata di login direttamente al backend di Supabase
            const response = await fetch('/api/login-direct', {
              method: 'POST',
              body: formData,
            });
            
            const result = await response.json();
            console.log('Login result:', result);
            
            if (result.error) {
              // Mostra l'errore
              errorMessage.textContent = result.error;
              errorContainer.classList.remove('hidden');
              
              // Ripristina il pulsante
              submitButton.disabled = false;
              buttonText.textContent = 'Accedi';
              loadingIcon.classList.add('hidden');
            } else if (result.success && result.redirectUrl) {
              // Effettua il redirect
              console.log('Redirecting to:', result.redirectUrl);
              window.location.href = result.redirectUrl;
            }
          } catch (error) {
            console.error('Login error:', error);
            
            // Mostra l'errore
            errorMessage.textContent = 'Si è verificato un errore durante il login';
            errorContainer.classList.remove('hidden');
            
            // Ripristina il pulsante
            submitButton.disabled = false;
            buttonText.textContent = 'Accedi';
            loadingIcon.classList.add('hidden');
          }
        });
      });
    </script>
  </body>
  </html>
  `;

  return new NextResponse(loginHTML, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 