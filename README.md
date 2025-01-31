
---

# **BlogUI 🌟**  

A sleek and responsive **User Interface** for a Blog Application, built using **Material-UI** and modern React practices.  

🔗 **Live Demo**: [BlogUI on Vercel](https://blog-ui-liart.vercel.app/)  

---

## 🚀 **Features**  

✅ **Modern UI Design** – Built with Material-UI for a clean and responsive layout.  
✅ **Dynamic Blog Display** – Showcases blogs with pagination and search functionality.  
✅ **Image Rendering** – Supports blog images uploaded via BlogAPI.  
✅ **Interactive Components** – Includes buttons, dialogs, and forms for better UX.  
✅ **Seamless API Integration** – Fetches and updates data through BlogAPI.  

---

## 🛠️ **Technologies Used**  

- **React** – Frontend library.  
- **Material-UI** – UI component library for styling and responsiveness.  
- **Axios** – Handles API requests efficiently.  
- **React Router** – Enables smooth navigation.  
- **Vercel** – Hosting platform for deployment.  

---

## 📂 **Project Structure**  

```
BlogUI/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── services/           # API service layer
│   ├── styles/             # Custom styles and themes
│   ├── App.js              # Main application component
│   └── index.js            # React DOM rendering entry
└── package.json            # Project dependencies and metadata
```

---

## 📦 **Installation and Setup**  

### **Prerequisites**  
🔹 Install **Node.js** (v14 or later).  

### **Steps**  

1. Clone the repository:  
   ```bash
   git clone https://github.com/Abhii039/BlogUI.git
   cd BlogUI
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Configure the API base URL in `src/services/api.js`:  
   ```javascript
   const BASE_URL = "http://localhost:5000/api"; // Change to your BlogAPI URL
   export default BASE_URL;
   ```

4. Start the development server:  
   ```bash
   npm start
   ```

5. Open `http://localhost:3000` in your browser.  

---

## 🎨 **Key Components**  

- **BlogList** – Displays all blogs with pagination and search.  
- **BlogDetails** – Shows a single blog with full details.  
- **CreateBlog** – Form to create or edit a blog.  
- **Navbar** – Provides navigation links and a search bar.  

---

## 🚧 **Roadmap**  

- [ ] Add dark mode support.  
- [ ] Implement user profile management.  
- [ ] Improve error handling and loading states.  
- [ ] Add animations for better UX.  

---

## 🛡️ **License**  

This project is licensed under the [MIT License](LICENSE).  

---

## 🙌 **Contributing**  

1. Fork the repository.  
2. Create a feature branch (`git checkout -b feature-name`).  
3. Commit your changes (`git commit -m "Add new feature"`).  
4. Push to the branch (`git push origin feature-name`).  
5. Open a **Pull Request**.  

---

## 📧 **Contact**  

For inquiries or suggestions, reach out to:  
- **👤 Name**: Abhi Dobariya  
- **📧 Email**: abhidobariya2004@gmail.com  
- **🌎 GitHub**: [Abhii039](https://github.com/Abhii039)  

---
