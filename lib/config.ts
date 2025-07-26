
export const config = {
  // Backend API URL - can be overridden by environment variable
  BACKEND_URL: getUrl(),
  
  // Frontend URL for OAuth callbacks
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
} as const;


function getUrl() :string{

  const envType=process.env.ENV_TYPE || "dev";

  if(envType==="dev") return process.env.NEXT_PUBLIC_BACKEND_URL_DEV!;
  else if(envType==="dep") return process.env.NEXT_PUBLIC_BACKEND_URL_DEP!;

  return process.env.NEXT_PUBLIC_BACKEND_URL_DEV!;

}