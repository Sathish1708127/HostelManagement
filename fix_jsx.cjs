const fs = require('fs');
const base = 'd:/html/fun/Hostel Management/src/features';

// Fix 1: AnnouncementsPage - missing closing </div> for grid div
let ann = fs.readFileSync(base + '/announcements/AnnouncementsPage.tsx', 'utf8');
ann = ann.replace(
  '              <button className="primary-button">Publish</button>\n            </div>\n        </div>\n      )}',
  '              <button className="primary-button">Publish</button>\n            </div>\n          </div>\n        </div>\n      )}'
);
fs.writeFileSync(base + '/announcements/AnnouncementsPage.tsx', ann, 'utf8');
console.log('1. AnnouncementsPage fixed');

// Fix 2: BookingsPage - missing closing </div> for grid div
let book = fs.readFileSync(base + '/bookings/BookingsPage.tsx', 'utf8');
book = book.replace(
  '            <button className="primary-button" style={{ alignSelf: \'end\' }}>Check availability</button>\n          </div>\n      )}',
  '            <button className="primary-button" style={{ alignSelf: \'end\' }}>Check availability</button>\n          </div>\n        </div>\n      )}'
);
fs.writeFileSync(base + '/bookings/BookingsPage.tsx', book, 'utf8');
console.log('2. BookingsPage fixed');

// Fix 3: CommunityPage - missing closing </div> for post div
let comm = fs.readFileSync(base + '/community/CommunityPage.tsx', 'utf8');
comm = comm.replace(
  '                <button className="row-action">Share</button>\n              </div>\n          ))}',
  '                <button className="row-action">Share</button>\n              </div>\n            </div>\n          ))}'
);
fs.writeFileSync(base + '/community/CommunityPage.tsx', comm, 'utf8');
console.log('3. CommunityPage fixed');

// Fix 4: MedicalPage - truncated file, needs full content appended
let med = fs.readFileSync(base + '/medical/MedicalPage.tsx', 'utf8');
if (!med.includes('</main>')) {
  med = med.trimEnd() + `\n          <div className="panel-heading"><h2>Medical records</h2></div>
          <div className="data-table" role="table">
            <div className="data-row data-header" role="row">
              <span>ID</span><span>Student</span><span>Type</span><span>Description</span><span>Urgency</span><span>Status</span><span>Date</span><span />
            </div>
            {reports.map((r) => (
              <div className="data-row" role="row" key={r.id}>
                <strong>{r.id}</strong><span>{r.student}</span><span>{r.type}</span>
                <span>{r.description}</span>
                <span className={\`priority \${r.urgency}\`}>{r.urgency}</span>
                <span>{r.status.replace('_', ' ')}</span>
                <span>{r.createdAt}</span>
                <button className="row-action">View</button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
`;
  fs.writeFileSync(base + '/medical/MedicalPage.tsx', med, 'utf8');
  console.log('4. MedicalPage fixed');
}

// Fix 5: ReportsPage - missing closing divs
let rep = fs.readFileSync(base + '/reports/ReportsPage.tsx', 'utf8');
rep = rep.replace(
  '          <div className="empty-state" style={{ padding: \'40px 20px\' }}>\n            <p>Report data will be fetched from the backend.</p>\n            <p className="muted">Select date range and filters to generate the report.</p>\n            <div style={{ display: \'flex\', gap: 12, justifyContent: \'center\', marginTop: 16 }}>\n              <input type="date" className="styled-input" style={{ width: 160 }} />\n              <input type="date" className="styled-input" style={{ width: 160 }} />\n              <button className="primary-button">Generate</button>\n            </div>\n        </div>\n      )}',
  '          <div className="empty-state" style={{ padding: \'40px 20px\' }}>\n            <p>Report data will be fetched from the backend.</p>\n            <p className="muted">Select date range and filters to generate the report.</p>\n            <div style={{ display: \'flex\', gap: 12, justifyContent: \'center\', marginTop: 16 }}>\n              <input type="date" className="styled-input" style={{ width: 160 }} />\n              <input type="date" className="styled-input" style={{ width: 160 }} />\n              <button className="primary-button">Generate</button>\n            </div>\n          </div>\n        </div>\n      )}'
);
fs.writeFileSync(base + '/reports/ReportsPage.tsx', rep, 'utf8');
console.log('5. ReportsPage fixed');

console.log('\nAll 5 files fixed!');
