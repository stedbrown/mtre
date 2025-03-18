import { NextRequest, NextResponse } from 'next/server';

// Questa route risponde alle richieste GET per /[locale]/admin/login
// Bypassando completamente il middleware
export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  const locale = params.locale;
  const loginHTML = `
  <!DOCTYPE html>
  <html lang="${locale}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login MTRE Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="min-h-screen flex flex-col justify-center py-12 px-6 bg-gradient-to-b from-gray-50 to-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">M.T.R.E. Admin</h2>
        <p class="mt-2 text-sm text-gray-600">
          Accedi all'area amministrativa
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
        <form id="loginForm" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="nome@esempio.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div id="errorContainer" class="rounded-md bg-red-50 p-4 hidden">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p id="errorMessage" class="text-sm text-red-700"></p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              id="submitButton"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <span id="loadingIcon" class="hidden">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span id="buttonText">Accedi</span>
            </button>
          </div>
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

            // Effettua la chiamata di login
            const response = await fetch('/api/login', {
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