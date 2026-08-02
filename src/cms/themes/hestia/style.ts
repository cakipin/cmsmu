export const css = `
:root {
  --primary: #e91e63;
  --primary-hover: #c2185b;
  --text: #3C4858;
  --gray: #999999;
  --light-gray: #E5E5E5;
  --bg: #f5f5f5;
  --white: #ffffff;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Roboto', sans-serif;
  color: var(--text);
  background-color: var(--bg);
  line-height: 1.5;
  font-size: 14px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Roboto Slab', serif;
  font-weight: 700;
  color: #3C4858;
  margin-top: 20px;
  margin-bottom: 10px;
}

a { color: var(--primary); text-decoration: none; transition: 0.3s; }
a:hover { color: var(--primary-hover); }

.text-center { text-align: center; }
.text-info { color: #00bcd4; }

.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}

/* NAVBAR */
.navbar {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1050;
  background-color: transparent;
  color: #fff;
  padding: 15px 0;
  transition: all 0.3s;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 18px;
  font-weight: 400;
  color: #fff;
}

.navbar-brand:hover { color: rgba(255,255,255,0.8); }

.navbar-nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #fff;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
}

.nav-link:hover { color: rgba(255,255,255,0.8); }

/* HERO */
.hero {
  position: relative;
  height: 60vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80');
  background-size: cover;
  background-position: center center;
  color: #fff;
}

.hero::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.hero .container {
  position: relative;
  z-index: 2;
}

.hero-title {
  color: #fff;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.hero-subtitle {
  color: #eee;
  font-size: 1.3rem;
  font-weight: 300;
  margin-bottom: 30px;
}

.page-header {
  height: 50vh;
  min-height: 300px;
}

.btn {
  display: inline-block;
  padding: 12px 30px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 30px;
  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 2px 0 rgba(233, 30, 99, 0.14), 0 3px 1px -2px rgba(233, 30, 99, 0.2), 0 1px 5px 0 rgba(233, 30, 99, 0.12);
}

.btn-primary {
  background-color: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  box-shadow: 0 14px 26px -12px rgba(233, 30, 99, 0.42), 0 4px 23px 0 rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(233, 30, 99, 0.2);
  color: #fff;
}

/* SECTION BLOG */
.section-blog {
  padding: 80px 0;
  background: var(--bg);
}

.section-title {
  font-size: 2.25rem;
  margin-bottom: 15px;
}

.section-description {
  color: var(--gray);
  font-size: 1.1rem;
  margin-bottom: 50px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

/* CARD */
.card {
  background: var(--white);
  border-radius: 6px;
  box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-image {
  height: 220px;
  border-radius: 6px 6px 0 0;
  background-size: cover;
  background-position: center;
}

.card-body {
  padding: 30px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-category {
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 0;
}

.card-title {
  margin-top: 0;
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.card-title a {
  color: #3C4858;
}

.card-title a:hover {
  color: var(--primary);
}

.card-description {
  color: var(--gray);
  margin-bottom: 20px;
  flex-grow: 1;
}

.card-author {
  font-size: 12px;
  color: var(--gray);
  border-top: 1px solid var(--light-gray);
  padding-top: 15px;
}

/* SINGLE POST */
.main {
  background: #FFF;
  position: relative;
  z-index: 3;
}

.main-raised {
  margin: -60px 30px 0px;
  border-radius: 6px;
  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
}

.section {
  padding: 70px 0;
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  max-width: 800px;
  margin: 0 auto;
}

.post-content img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 20px 0;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
}

.post-content h2, .post-content h3 {
  margin-top: 40px;
}

/* FOOTER */
.footer {
  padding: 30px 0;
  text-align: center;
  color: var(--gray);
}
`;
