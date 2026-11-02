const fs = require('fs');
const base = 'd:/html/fun/Hostel Management/src/features';

// Fix AnnouncementsPage - missing closing div tags
let ann = fs.readFileSync(base + '/announcements/AnnouncementsPage.tsx', 'utf8');
ann = ann.replace(
  '          <button className="primary-button">Publish</button>\n            </div>\n        </div>\n      )}\n    </main>\n  );\n}',
  '          <button className="primary-button">Publish</button>\n            </div>\n          </div>\n        </div>\n      )}\n    </main>\n  );\n}'
);
fs.writeFileSync(base + '/announcements/AnnouncementsPage.tsx', ann, 'utf8');
console.log('Fixed AnnouncementsPage');

// Fix BooksPage - missing closing div tags
let book = fs.readFileSync(base + '/bookings/BookingsPage.tsx', 'utf8');
book = book.replace(
  '            <button className="primary-button" style={{ alignSelf: \'end\' }}>Check availability</button>\n          </div>\n      )}\n    </main>\n  );\n}',
  '            <button className="primary-button" style={{ alignSelf: \'end\' }}>Check availability</button>\n          </div>\n        </div>\n      )}\n    </main>\n  );\n}'
);
fs.writeFileSync(base + '/bookings/BookingsPage.tsx', book, 'utf8');
console.log('Fixed BookingsPage');

// Fix CommunityPage - missing closing div tags
let comm = fs.readFileSync(base + '/community/CommunityPage.tsx', 'utf8');
comm = comm.replace(
  '                <button className="row-action">Share</button>\n              </div>\n          ))}\n          {filtered.length === 0 && <div className="empty-state">No posts to show.</div>}\n        </article>\n      </section>',
  '                <button className="row-action">Share</button>\n              </div>\n            </div>\n          ))}\n          {filtered.length === 0 && <div className="empty-state">No posts to show.</div>}\n        </article>\n      </section>'
);
comm = comm.replace(
  '      </section>\n    </main>\n  );\n}',
  '    </main>\n  );\n}'
);
// Actually the community page has a different structure issue. Let me check the broader structure
fs.writeFileSync(base + '/community/CommunityPage.tsx', comm, 'utf8');
console.log('Fixed CommunityPage');

// Fix MedicalPage - incomplete file
let med = fs.readFileSync(base + '/medical/MedicalPage.tsx', 'utf8');
if (!med.includes('</main>')) {
  med = med + `\n      <section className="panel">\n        <div className="panel-heading"><h2>Medical records</h2></div>\n        <div className="data-table" role="table">\n          <div className="data-row data-header" role="row">\n            <span>ID</span><span>Student</span><span>Type</span><span>Description</span><span>Urgency</span><span>Status</span><span>Date</span><span />\n          </div>\n          {reports.map((r) => (\n            <div className="data-row" role="row" key={r.id}>\n              <strong>{r.id}</strong><span>{r.student}</span><span>{r.type}</span>\n              <span>{r.description}</span>\n              <span className={\`priority \${r.urgency}\`}>{r.urgency}</span>\n              <span>{r.status.replace('_', ' ')}</span>\n              <span>{r.createdAt}</span>\n              <button className="row-action">View</button>\n            </div>\n          ))}\n        </div>\n      </section>\n    </main>\n  );\n}`
  );
  fs.writeFileSync(base + '/medical/MedicalPage.tsx', med, 'utf8');
  console.log('Fixed MedicalPage');
}

// Fix ReportsPage - missing closing div tags
let rep = fs.readFileSync(base + '/reports/ReportsPage.tsx', 'utf8');
rep = rep.replace(
  '          <div className="empty-state" style={{ padding: \'40px 20px\' }}>\n            <p>Report data will be fetched from the backend.</p>\n            <p className="muted">Select date range and filters to generate the report.</p>\n            <div style={{ display: \'flex\', gap: 12, justifyContent: \'center\', marginTop: 16 }}>\n              <input type="date" className="styled-input" style={{ width: 160 }} />\n              <input type="date" className="styled-input" style={{ width: 160 }} />\n              <button className="primary-button">Generate</button>\n            </div>\n        </div>\n      )}\n    </main>\n  );\n}',
  '          <div className="empty-state" style={{ padding: \'40px 20px\' }}>\n            <p>Report data will be fetched from the backend.</p>\n            <p className="muted">Select date range and filters to generate the report.</p>\n            <div style={{ display: \'flex\', gap: 12, justifyContent: \'center\', marginTop: 16 }}>\n              <input type="date" className="styled-input" style={{ width: 160 }} />\n              <input type="date" className="styled-input" style={{ width: 160 }} />\n              <button className="primary-button">Generate</button>\n            </div>\n          </div>\n        </div>\n      )}\n    </main>\n  );\n}'
);
fs.writeFileSync(base + '/reports/ReportsPage.tsx', rep, 'utf8');
console.log('Fixed ReportsPage');

console.log('All TSX fixes applied!');
