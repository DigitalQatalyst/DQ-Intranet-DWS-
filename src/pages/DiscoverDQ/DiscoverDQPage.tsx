import React from "react";
import s from "./DiscoverDQPage.module.css";

const DiscoverDQPage: React.FC = () => {
  return (
    <div className={s.root}>
      {/* HERO */}
      <header className={s.hero}>
        <div className={s.container}>
          <div className={s.heroGrid}>
            <div>
              <h1 className={s.h1}>Discover DQ</h1>
              <p className={s.sub}>
                A unified workspace where teams connect, co-work, and grow through purpose-driven collaboration.
              </p>
              <div className={s.btnRow}>
                <button className={`${s.btn} ${s.btnPrimary}`}>Explore Work Zones</button>
                <button className={`${s.btn} ${s.btnGhost}`}>View Growth Opportunities</button>
              </div>
              <div className={s.stats}>
                <div className={s.stat}><strong>5&nbsp;000+</strong><span>Active Users</span></div>
                <div className={s.stat}><strong>120+</strong><span>Ongoing Projects</span></div>
                <div className={s.stat}><strong>90%</strong><span>Collaboration Satisfaction</span></div>
              </div>
            </div>
            <div className={s.heroVisual} aria-label="Workspace diagram" />
          </div>
        </div>
      </header>

      {/* ZONES */}
      <section className={s.section}>
        <div className={s.container}>
          <h2 style={{textAlign:"center",marginBottom:8}}>Zones of Growth and Productivity</h2>
          <p style={{textAlign:"center",color:"var(--dq-muted)",maxWidth:720,margin:"0 auto 24px"}}>
            Each DQ Zone connects people, tools, and knowledge to drive performance and growth.
          </p>
          <div className={s.grid}>
            {[
              {t:"Learning Hub",d:"Build skills and certifications aligned to DQ competences."},
              {t:"Project Center",d:"Plan and deliver projects using shared boards and sprints."},
              {t:"Innovation Lab",d:"Co-create and test digital ideas that transform how we work."},
              {t:"Service Desk",d:"Get support, submit requests, and track resolutions seamlessly."},
              {t:"Community Forum",d:"Engage in debates, share stories, and celebrate wins."},
              {t:"Insights Gallery",d:"Explore dashboards and performance analytics."},
            ].map((c,i)=>(
              <article key={i} className={s.card}>
                <div className={s.cardTop}/>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
                <div style={{marginTop:10}}><a className={s.link}>Show more</a></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PERFORMANCE */}
      <section className={s.sectionAlt}>
        <div className={s.container}>
          <h2 style={{textAlign:"center",marginBottom:8}}>Workspace Performance Insights</h2>
          <p style={{textAlign:"center",color:"var(--dq-muted)",maxWidth:720,margin:"0 auto 16px"}}>
            Data-driven signals of how DQ teams learn, deliver, and collaborate.
          </p>
          <div className={s.chartWrap}>
            <div className={s.chartBars}>
              {[72,62,58,74,46].map((h,i)=>(
                <div key={i} style={{display:"grid",justifyItems:"center"}}>
                  <div className={s.bar} style={{height:`${h}%`}}/>
                  <div className={s.barLabel}/>
                </div>
              ))}
            </div>
          </div>
          <div style={{textAlign:"center",marginTop:16}}>
            <button className={`${s.btn} ${s.btnPrimary}`}>Explore Work Zones</button>
          </div>
        </div>
      </section>

      {/* DIRECTORY */}
      <section className={s.section}>
        <div className={s.container}>
          <h2 style={{textAlign:"center"}}>People & Teams Directory</h2>
          <p style={{textAlign:"center",color:"var(--dq-muted)",maxWidth:720,margin:"0 auto 18px"}}>
            Connect with DQ associates and teams driving workspace impact.
          </p>

          <div className={s.searchRow}>
            <input className={s.input} placeholder="Search people, teams, or projects…" />
            <button className={s.searchBtn}>Search</button>
          </div>

          <div className={s.grid}>
            {[
              "Learning & Development Team","Project Management Office","Innovation Council",
              "Support & Service Desk","Technology Squad","Communications Hub"
            ].map((t,i)=>(
              <article key={i} className={s.card}>
                <div className={s.cardTop}/>
                <h3>{t}</h3>
                <p style={{color:"var(--dq-muted)"}}>Short description about this team’s focus and collaboration.</p>
                <div style={{marginTop:10}}>
                  <button className={`${s.btn} ${s.btnPrimary}`}>View Profile</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className={s.support}>
        <div className={s.container}>
          <h2 style={{marginTop:0}}>Need Help?</h2>
          <p>Get quick support or connect with our workspace team to keep every initiative moving.</p>
          <button className={`${s.btn} ${s.btnPrimary}`}>Get Support</button>
        </div>
      </section>

      {/* PAGE FOOTER (local) */}
      <footer className={s.footer}>
        <div className={s.container}>
          <p>Every DQ associate — One Workspace, One Vision.</p>
        </div>
      </footer>
    </div>
  );
};

export default DiscoverDQPage;
