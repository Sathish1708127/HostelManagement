const fs = require('fs');

// Fix AnnouncementsPage - replace broken ending
let p = 'd:/html/fun/Hostel Management/src/features/announcements/AnnouncementsPage.tsx';
let c = fs.readFileSync(p, 'utf8');
// Find the last occurrence of '</div>' to understand structure
let idx = c.lastIndexOf('            </div>');
console.log('Announcements last inner close at:', idx);
// Replace the tail from "        </div>\n      )}"
let oldTail = '        </div>\n      )}\n    </main>\n  );\n}';
let newTail = '          </div>\n        </div>\n      )}\n    </main>\n  );\n}';
c = c.replace(oldTail, newTail);
fs.writeFileSync(p, c, 'utf8');
console.log('Fixed Announcements');

// Fix BookingsPage
p = 'd:/html/fun/Hostel Management/src/features/bookings/BookingsPage.tsx';
c = fs.readFileSync(p, 'utf8');
oldTail = '        </div>\n      )}\n    </main>\n  );\n}';
newTail = '          </div>\n        </div>\n      )}\n    </main>\n  );\n}';
c = c.replace(oldTail, newTail);
fs.writeFileSync(p, c, 'utf8');
console.log('Fixed Bookings');

// Fix ReportsPage  
p = 'd:/html/fun/Hostel Management/src/features/reports/ReportsPage.tsx';
c = fs.readFileSync(p, 'utf8');
oldTail = '        </div>\n      )}\n    </main>\n  );\n}';
newTail = '          </div>\n        </div>\n      )}\n    </main>\n  );\n}';
c = c.replace(oldTail, newTail);
fs.writeFileSync(p, c, 'utf8');
console.log('Fixed Reports');

// Fix CommunityPage
p = 'd:/html/fun/Hostel Management/src/features/community/CommunityPage.tsx';
c = fs.readFileSync(p, 'utf8');
oldTail = '          ))}\n          {filtered.length === 0 && <div className="empty-state">No posts to show.</div>}\n        </article>\n      </section>\n    </main>\n  );\n}';
newTail = '            </div>\n          ))}\n          {filtered.length === 0 && <div className="empty-state">No posts to show.</div>}\n        </article>\n      </section>\n    </main>\n  );\n}';
c = c.replace(oldTail, newTail);
fs.writeFileSync(p, c, 'utf8');
console.log('Fixed Community');

console.log('All done!');
