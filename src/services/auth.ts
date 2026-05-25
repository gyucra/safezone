import '@/lib/amplify'
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser,
} from 'aws-amplify/auth'

// Registrar nuevo usuario
export async function register(email: string, password: string, name: string) {
  const { isSignUpComplete, userId, nextStep } = await signUp({
    username: email,
    password,
    options: {
      userAttributes: { email, name },
    },
  })
  return { isSignUpComplete, userId, nextStep }
}

// Confirmar el código que llega al email
export async function confirmRegister(email: string, code: string) {
  const { isSignUpComplete } = await confirmSignUp({
    username: email,
    confirmationCode: code,
  })
  return isSignUpComplete
}


// Iniciar sesión
export async function login(email: string, password: string) {
  // Si ya hay una sesión activa, ciérrala primero
  try {
    await signOut()
  } catch {
    // no había sesión, seguimos normal
  }
  const { isSignedIn, nextStep } = await signIn({
    username: email,
    password,
  })
  return { isSignedIn, nextStep }
}

// Cerrar sesión
export async function logout() {
  await signOut()
}

// Obtener usuario actual
export async function getUser() {
  try {
    return await getCurrentUser()
  } catch {
    return null
  }
}