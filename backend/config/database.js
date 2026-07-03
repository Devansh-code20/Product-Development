const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/aisolutions.db');

let db = null;

async function initializeDatabase() {
  const SQL = await initSqlJs();

  // Load existing DB or create new
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new SQL.Database();
  }

  createTables();
  seedInitialData();
  saveDatabase();
  console.log('✅ SQLite database initialized');
  return db;
}

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company_name TEXT NOT NULL,
      country TEXT NOT NULL,
      job_title TEXT NOT NULL,
      job_details TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS solutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      industry TEXT NOT NULL,
      icon TEXT DEFAULT 'FaRobot',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS past_solutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      client TEXT NOT NULL,
      industry TEXT NOT NULL,
      description TEXT NOT NULL,
      result TEXT NOT NULL,
      year INTEGER NOT NULL,
      image_url TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      message TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('upcoming', 'past')),
      image_url TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      event_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function seedInitialData() {
  // Check if already seeded
  const stmt = db.prepare('SELECT COUNT(*) as count FROM admin_users');
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();

  if (row.count > 0) return;

  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('Admin@123', 10);

  db.run(`INSERT INTO admin_users (username, password) VALUES (?, ?)`,
    ['admin', hashedPassword]);

  // Seed solutions
  const solutions = [
    ['AI Virtual Assistant', 'Intelligent virtual assistants powered by NLP to handle customer queries 24/7, reducing support costs by up to 60%.', 'Customer Service', 'FaRobot'],
    ['Predictive Analytics Platform', 'Advanced ML models to predict equipment failures, market trends, and customer behaviour before they happen.', 'Manufacturing & Finance', 'FaChartLine'],
    ['Automated Quality Control', 'Computer vision systems that inspect products at scale, catching defects with 99.8% accuracy.', 'Manufacturing', 'FaCogs'],
    ['Intelligent Document Processing', 'AI-powered extraction and processing of data from invoices, contracts, and forms automatically.', 'Legal & Finance', 'FaFileAlt'],
    ['Smart Recommendation Engine', 'Personalisation engines that increase engagement and sales through highly relevant content recommendations.', 'E-Commerce & Media', 'FaBrain'],
    ['AI-Powered Cybersecurity', 'Real-time threat detection and response systems that protect digital infrastructure using behavioural AI.', 'All Industries', 'FaShieldAlt'],
  ];

  solutions.forEach(([title, description, industry, icon]) => {
    db.run(`INSERT INTO solutions (title, description, industry, icon) VALUES (?, ?, ?, ?)`,
      [title, description, industry, icon]);
  });

  // Seed past solutions
  const past = [
    ['AI Customer Service Overhaul', 'TechCorp UK', 'Retail', 'Deployed a full AI virtual assistant handling over 50,000 daily queries, integrated with CRM systems.', 'Reduced customer support costs by 58% and improved satisfaction scores by 34%.', 2023],
    ['Predictive Maintenance System', 'SteelWorks Ltd', 'Manufacturing', 'Built ML pipeline analysing sensor data from 2,000+ machines to predict failures up to 72 hours in advance.', 'Reduced unplanned downtime by 71% saving £2.3M annually.', 2023],
    ['Fraud Detection Engine', 'NorthBank PLC', 'Finance', 'Developed real-time transaction anomaly detection model processing 1M+ transactions per day.', 'Detected 94% of fraudulent transactions, reducing financial losses by £4.1M per year.', 2022],
    ['Smart Inventory Management', 'RetailNation', 'Retail', 'AI-driven inventory forecasting system integrating with supply chain and POS data.', 'Reduced stock waste by 43% and improved fill rates to 97.8%.', 2022],
    ['HR Talent Intelligence', 'GlobalHire Inc', 'Human Resources', 'AI screening and matching platform that analyses CVs and job requirements to rank candidates.', 'Reduced time-to-hire by 62% and improved retention rates by 28%.', 2024],
    ['Medical Imaging AI', 'HealthFirst NHS Trust', 'Healthcare', 'Deep learning model to assist radiologists in detecting anomalies in X-ray and MRI scans.', 'Improved early detection rates by 41% and reduced reporting time by 55%.', 2024],
  ];

  past.forEach(([title, client, industry, description, result, year]) => {
    db.run(`INSERT INTO past_solutions (title, client, industry, description, result, year) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, client, industry, description, result, year]);
  });

  // Seed testimonials
  const testimonials = [
    ['Sarah Mitchell', 'TechCorp UK', 'Chief Operations Officer', 'AI-Solutions transformed our customer service department completely. Their virtual assistant handles queries with a level of sophistication we had not thought possible at this price point.', 5],
    ['James Thornton', 'SteelWorks Ltd', 'Head of Maintenance', 'The predictive maintenance system has been a game-changer. We caught three major failures before they happened, saving us millions. Highly recommended.', 5],
    ['Priya Sharma', 'NorthBank PLC', 'VP of Risk Management', 'Their fraud detection engine is outstanding. Integration was smooth and the results exceeded all KPIs we set. The team is professional and responsive.', 5],
    ['Daniel Brooks', 'RetailNation', 'Supply Chain Director', 'We were sceptical at first, but the ROI from the inventory AI was clear within three months. AI-Solutions delivered exactly what they promised.', 4],
    ['Emma Collins', 'GlobalHire Inc', 'Chief People Officer', 'The talent intelligence platform has completely changed how we hire. Our recruiters now focus on relationship-building while the AI handles the heavy lifting of screening.', 5],
    ['Dr. Amir Hassan', 'HealthFirst NHS Trust', 'Lead Radiologist', 'As a clinician I was cautious about AI in diagnostics, but this system genuinely assists without replacing judgement. Early detection improvements are statistically significant.', 4],
  ];

  testimonials.forEach(([client_name, company, position, message, rating]) => {
    db.run(`INSERT INTO testimonials (client_name, company, position, message, rating) VALUES (?, ?, ?, ?, ?)`,
      [client_name, company, position, message, rating]);
  });

  // Seed articles
  const articles = [
    ['The Future of AI in Enterprise: 2025 and Beyond', 'As AI moves from experimental to mission-critical, enterprises must rethink their technology strategies.', 'Artificial intelligence has shifted from being a competitive advantage to a business necessity. In 2025, organisations that have not integrated AI into core operations risk falling behind. This article explores the key trends shaping enterprise AI adoption and what businesses must do to stay ahead.', 'Dr. Barnali Das', 'AI Trends'],
    ['How NLP is Revolutionising Customer Support', 'Natural language processing is enabling companies to deliver faster, smarter, and more empathetic customer service.', 'Customer expectations have never been higher. With NLP advancements, businesses can now deploy conversational AI that understands context, detects sentiment, and provides accurate responses in milliseconds. We look at the technology behind modern AI assistants.', 'Alex Turner', 'Technology'],
    ['Case Study: Reducing Manufacturing Downtime with Predictive AI', 'How SteelWorks Ltd cut unplanned downtime by 71% using our predictive maintenance solution.', 'In this detailed case study, we walk through the challenge, solution architecture, implementation timeline, and measurable outcomes delivered to SteelWorks Ltd. A testament to what AI-Solutions can achieve in heavy industry.', 'Sarah Okafor', 'Case Study'],
    ['Ethics in AI: Building Responsible Solutions', 'Responsible AI is not optional — it is a legal and moral imperative for modern businesses.', 'From GDPR compliance to algorithmic bias, AI ethics covers a broad spectrum. At AI-Solutions, responsibility is built into every layer of our development process. This piece outlines our ethical framework and why it matters for our clients.', 'Dr. Barnali Das', 'Ethics'],
    ['Small Businesses and AI: Affordable Innovation', 'AI is no longer reserved for enterprise giants. Here is how small and medium businesses can benefit today.', 'Cost has historically been a barrier to AI adoption for SMEs. With cloud-based AI services and modular solutions, the landscape has fundamentally changed. We present practical entry points for small businesses looking to leverage AI.', 'James Liu', 'SME'],
    ['AI-Powered Cybersecurity: Staying Ahead of Threats', 'Traditional security tools are not enough. Behavioural AI is the new frontier in digital defence.', 'Cyber threats are evolving faster than human teams can respond. Behavioural AI analyses patterns across millions of data points in real time, flagging anomalies before they become breaches. This article explains the architecture behind our cybersecurity AI platform.', 'Rachel Ford', 'Cybersecurity'],
  ];

  articles.forEach(([title, excerpt, content, author, category]) => {
    db.run(`INSERT INTO articles (title, excerpt, content, author, category) VALUES (?, ?, ?, ?, ?)`,
      [title, excerpt, content, author, category]);
  });

  // Seed events
  const events = [
    ['AI Innovation Summit 2025', 'Join industry leaders for a full-day conference on the latest AI breakthroughs and enterprise applications.', '2025-09-15', 'ExCeL London, Royal Victoria Dock, London', 'upcoming'],
    ['AI in Healthcare Workshop', 'A focused workshop for NHS trusts and private health providers exploring AI diagnostics and patient management.', '2025-10-22', 'Manchester Central Convention Complex', 'upcoming'],
    ['Smart Manufacturing Expo', 'Live demonstrations of AI-powered automation, predictive maintenance, and quality control systems.', '2025-11-08', 'NEC Birmingham', 'upcoming'],
    ['AI Solutions Annual Conference 2024', 'Our flagship annual conference attracting 500+ attendees from across the UK tech industry.', '2024-09-20', 'The ICC, Birmingham', 'past'],
    ['FinTech AI Forum 2024', 'Panel discussions and workshops on fraud detection, algorithmic trading, and regulatory compliance.', '2024-06-14', 'Canary Wharf, London', 'past'],
    ['Northern AI Meetup', 'Informal networking event for AI professionals and enthusiasts in the North of England.', '2024-04-11', 'Digital Campus, Leeds', 'past'],
  ];

  events.forEach(([title, description, date, location, type]) => {
    db.run(`INSERT INTO events (title, description, date, location, type) VALUES (?, ?, ?, ?, ?)`,
      [title, description, date, location, type]);
  });

  // Seed gallery
  const gallery = [
    ['Opening Keynote', '/gallery/event1.jpg', 'AI Solutions Annual Conference 2024'],
    ['Networking Session', '/gallery/event2.jpg', 'AI Solutions Annual Conference 2024'],
    ['Workshop Demo', '/gallery/event3.jpg', 'AI Solutions Annual Conference 2024'],
    ['Panel Discussion', '/gallery/event4.jpg', 'FinTech AI Forum 2024'],
    ['Award Ceremony', '/gallery/event5.jpg', 'FinTech AI Forum 2024'],
    ['Attendee Exhibition', '/gallery/event6.jpg', 'Northern AI Meetup'],
    ['Product Launch', '/gallery/event7.jpg', 'Smart Manufacturing Expo'],
    ['Live Demo Stage', '/gallery/event8.jpg', 'AI Innovation Summit 2025'],
  ];

  gallery.forEach(([title, image_url, event_name]) => {
    db.run(`INSERT INTO gallery (title, image_url, event_name) VALUES (?, ?, ?)`,
      [title, image_url, event_name]);
  });

  console.log('✅ Database seeded with initial data');
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

function getDb() {
  return db;
}

// Helper to run queries and return results as arrays of objects
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function queryOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
}

function runQuery(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
  // Get last insert rowid
  const result = queryOne('SELECT last_insert_rowid() as id');
  return { lastInsertRowid: result ? result.id : null };
}

module.exports = { initializeDatabase, getDb, saveDatabase, queryAll, queryOne, runQuery };
