# JRIIT CMS Dashboard

A modern, comprehensive Content Management System built with Next.js 15, designed specifically for the JRIIT (Jawaharlal Nehru Institute of Information Technology) website.

## 🚀 Features

### 📊 **Dashboard Overview**
- Modern, responsive dashboard with beautiful UI/UX
- Real-time statistics and analytics
- Quick actions and recent activity feed
- Professional design with Tailwind CSS

### 📝 **Content Management**
- **News Management**: Create, edit, and manage news articles with breaking news and featured content
- **Events Management**: Manage events, workshops, and conferences with registration details
- **Programs Management**: Academic programs and courses with department associations
- **Departments Management**: Department information with faculty and program counts
- **Faculty Management**: Faculty profiles with photos, specializations, and contact info
- **Pages Management**: Static pages with SEO optimization and menu management
- **Global Settings**: Site-wide configuration with tabbed interface

### 🔐 **Authentication & Security**
- NextAuth.js v5 authentication
- JWT-based sessions
- Protected routes and middleware
- Role-based access control

### 🗄️ **Database & API**
- Prisma ORM with SQLite/PostgreSQL support
- Comprehensive database schema
- RESTful API endpoints
- Type-safe database operations

### 🎨 **UI/UX Features**
- Responsive design for all screen sizes
- Beautiful color-coded statistics cards
- Advanced filtering and search capabilities
- Interactive hover effects and transitions
- Professional status badges and indicators
- Empty state handling with call-to-action buttons

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Heroicons
- **Authentication**: NextAuth.js v5
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Forms**: React Hook Form
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## 📦 **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jriit-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables in `.env.local`

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Dashboard: `http://localhost:3000/dashboard`
   - Login: `http://localhost:3000/login`

## 🔑 **Default Login Credentials**

- **Email**: `admin@jriit.com`
- **Password**: `admin123`

## 📁 **Project Structure**

```
jriit-cms/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   ├── dashboard/          # Dashboard pages
│   │   └── login/              # Authentication pages
│   ├── components/             # Reusable components
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript type definitions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
└── public/                     # Static assets
```

## 🎯 **Dashboard Pages**

### 📰 **News Management**
- Create and manage news articles
- Breaking news and featured content
- Category and tag management
- Publication status control

### 🎓 **Events Management**
- Event creation and scheduling
- Registration management
- Location and capacity tracking
- Public/private event settings

### 📚 **Programs Management**
- Academic program management
- Department associations
- Degree and duration tracking
- Featured program highlighting

### 🏢 **Departments Management**
- Department information
- Faculty and program counts
- Contact information
- Active/inactive status

### 👥 **Faculty Management**
- Faculty profile management
- Photo uploads
- Specialization tracking
- Department associations

### 📄 **Pages Management**
- Static page creation
- SEO optimization
- Menu management
- Page hierarchy support

### ⚙️ **Global Settings**
- Site configuration
- Contact information
- Social media links
- SEO defaults
- Maintenance mode
- File upload settings

## 🔄 **Development Workflow**

1. **Feature Development**
   - Create feature branches
   - Implement changes
   - Test thoroughly
   - Create pull requests

2. **Code Quality**
   - TypeScript for type safety
   - ESLint for code quality
   - Prettier for code formatting
   - Comprehensive error handling

3. **Database Management**
   - Prisma migrations
   - Database seeding
   - Schema updates

## 🚀 **Deployment**

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- DigitalOcean App Platform

## 📝 **API Documentation**

Comprehensive API documentation is available in:
- `API_DOCS.md` - Basic API documentation
- `COMPREHENSIVE_API_DOCS.md` - Detailed API reference

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 👥 **Team**

- **Developer**: [Your Name]
- **Client**: JRIIT (Jawaharlal Nehru Institute of Information Technology)
- **Project**: CMS Dashboard for JRIIT Website

## 📞 **Support**

For support and questions, please contact the development team.

---

**Built with ❤️ for JRIIT**