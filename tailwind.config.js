// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: ["./src/**/*.{js,ts,jsx,tsx}"], // Adjust if your files are in a different directory
//     theme: {
//       extend: {
//         colors: {
//           customPurple: "#44229f",
//         },
//       },
//     },
//     plugins: [],
//   };
  

  /** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        color:{
            racist: "#44229f"
        }
      },
    },
    plugins: [],
  }