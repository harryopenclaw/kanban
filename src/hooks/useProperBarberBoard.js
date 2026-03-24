import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "properbarber-kanban-v2";

const defaultCards = {
  "pb-249": {
    "id": "pb-249",
    "title": "Noah Dow",
    "subtitle": null,
    "email": "noahdow1234@gmail.com",
    "signupDate": "Jan 21, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-250": {
    "id": "pb-250",
    "title": "Manny",
    "subtitle": null,
    "email": "mankeert.dhillon@gmail.com",
    "signupDate": "Mar 7, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-251": {
    "id": "pb-251",
    "title": "Adam",
    "subtitle": null,
    "email": "adamrostis@gmail.com",
    "signupDate": "Jan 20, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-252": {
    "id": "pb-252",
    "title": "sid",
    "subtitle": null,
    "email": "siddharthbalachander@gmail.com",
    "signupDate": "Feb 11, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-253": {
    "id": "pb-253",
    "title": "Jennifer",
    "subtitle": null,
    "email": "jennifer@properbarber.club",
    "signupDate": "Jan 30, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-254": {
    "id": "pb-254",
    "title": "Brittany R Hall",
    "subtitle": null,
    "email": "brittrachelhall@gmail.com",
    "signupDate": "Feb 5, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-255": {
    "id": "pb-255",
    "title": "James",
    "subtitle": null,
    "email": "mckeejw13@gmail.com",
    "signupDate": "Jan 20, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-256": {
    "id": "pb-256",
    "title": "Cailean Jan",
    "subtitle": null,
    "email": "y49zkp7x2w@privaterelay.appleid.com",
    "signupDate": "Jan 17, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-257": {
    "id": "pb-257",
    "title": "Nadeem Jan",
    "subtitle": null,
    "email": "abbas_nad@hotmail.com",
    "signupDate": "Jan 17, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-258": {
    "id": "pb-258",
    "title": "Derek Gentile",
    "subtitle": null,
    "email": "gentilederek11@hotmail.com",
    "signupDate": "Mar 3, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-259": {
    "id": "pb-259",
    "title": "Karan",
    "subtitle": null,
    "email": "karanwariach45@gmail.com",
    "signupDate": "Feb 7, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-260": {
    "id": "pb-260",
    "title": "",
    "subtitle": null,
    "email": "jessica+customer@properbarber.club",
    "signupDate": "Jan 16, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-247": {
    "id": "pb-247",
    "title": "Neil Smith",
    "subtitle": null,
    "email": "neilsmithdr@gmail.com",
    "signupDate": "Feb 13, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-265": {
    "id": "pb-265",
    "title": "Baljeet Singh",
    "subtitle": null,
    "email": "baljeet808singh@gmail.com",
    "signupDate": "Jan 7, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-215": {
    "id": "pb-215",
    "title": "John Leahy",
    "subtitle": null,
    "email": "jleahy@immediac.com",
    "signupDate": "Jan 14, 2026",
    "appointmentCount": 9,
    "bookingNote": "9 appts \u00b7 first: Jan 15 \u00b7 1d after signup"
  },
  "pb-214": {
    "id": "pb-214",
    "title": "Mark Gascoigne",
    "subtitle": null,
    "email": "mark@trampolinebranding.com",
    "signupDate": "Jan 15, 2026",
    "appointmentCount": 4,
    "bookingNote": "4 appts \u00b7 first: Jan 16 \u00b7 1d after signup"
  },
  "pb-210": {
    "id": "pb-210",
    "title": "Michael D. Mailman",
    "subtitle": null,
    "email": "mdm@michaeldmailman.com",
    "signupDate": "Jan 16, 2026",
    "appointmentCount": 5,
    "bookingNote": "5 appts \u00b7 first: Jan 16 \u00b7 same day"
  },
  "pb-239": {
    "id": "pb-239",
    "title": "Brian Brewer",
    "subtitle": null,
    "email": "bjbrewer@gmail.com",
    "signupDate": "Jan 19, 2026",
    "appointmentCount": 6,
    "bookingNote": "6 appts \u00b7 first: Jan 24 \u00b7 5d after signup"
  },
  "pb-207": {
    "id": "pb-207",
    "title": "Alper",
    "subtitle": null,
    "email": "alperyuce98@gmail.com",
    "signupDate": "Jan 20, 2026",
    "appointmentCount": 4,
    "bookingNote": "4 appts \u00b7 first: Jan 20 \u00b7 same day"
  },
  "pb-233": {
    "id": "pb-233",
    "title": "Nathan Kroll",
    "subtitle": null,
    "email": "nkroll@currentstudios.ca",
    "signupDate": "Jan 20, 2026",
    "appointmentCount": 14,
    "bookingNote": "14 appts \u00b7 first: Jan 23 \u00b7 3d after signup"
  },
  "pb-203": {
    "id": "pb-203",
    "title": "Mike Roberts",
    "subtitle": null,
    "email": "mroberts1705@gmail.com",
    "signupDate": "Jan 20, 2026",
    "appointmentCount": 5,
    "bookingNote": "5 appts \u00b7 first: Jan 20 \u00b7 same day"
  },
  "pb-235": {
    "id": "pb-235",
    "title": "Patrick Kervin",
    "subtitle": null,
    "email": "pkervin@currentstudios.ca",
    "signupDate": "Jan 20, 2026",
    "appointmentCount": 3,
    "bookingNote": "3 appts \u00b7 first: Jan 23 \u00b7 3d after signup"
  },
  "pb-244": {
    "id": "pb-244",
    "title": "Gregory Dunn",
    "subtitle": null,
    "email": "gdunn.cgd@gmail.com",
    "signupDate": "Jan 21, 2026",
    "appointmentCount": 4,
    "bookingNote": "4 appts \u00b7 first: Jan 29 \u00b7 8d after signup"
  },
  "pb-243": {
    "id": "pb-243",
    "title": "Jacob LeBlanc",
    "subtitle": null,
    "email": "jacob.leblanc@dal.ca",
    "signupDate": "Jan 21, 2026",
    "appointmentCount": 8,
    "bookingNote": "8 appts \u00b7 first: Jan 28 \u00b7 7d after signup"
  },
  "pb-245": {
    "id": "pb-245",
    "title": "James Farquhar",
    "subtitle": null,
    "email": "farquhar.james001@icloud.com",
    "signupDate": "Jan 22, 2026",
    "appointmentCount": 10,
    "bookingNote": "10 appts \u00b7 first: Jan 30 \u00b7 8d after signup"
  },
  "pb-223": {
    "id": "pb-223",
    "title": "Caleb",
    "subtitle": null,
    "email": "cl679294@dal.ca",
    "signupDate": "Jan 22, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Jan 24 \u00b7 2d after signup"
  },
  "pb-205": {
    "id": "pb-205",
    "title": "Jason Doucet",
    "subtitle": null,
    "email": "jdoucet1383@gmail.com",
    "signupDate": "Jan 24, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Jan 24 \u00b7 same day"
  },
  "pb-228": {
    "id": "pb-228",
    "title": "Dr. Greg Patey",
    "subtitle": null,
    "email": "glpatey@gmail.com",
    "signupDate": "Jan 26, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Feb 19 \u00b7 24d after signup"
  },
  "pb-246": {
    "id": "pb-246",
    "title": "Colin Dillon",
    "subtitle": null,
    "email": "colin@dillonre.ca",
    "signupDate": "Jan 26, 2026",
    "appointmentCount": 9,
    "bookingNote": "9 appts \u00b7 first: Feb 3 \u00b7 8d after signup"
  },
  "pb-227": {
    "id": "pb-227",
    "title": "Saadat",
    "subtitle": null,
    "email": "saadat.qadri@gmail.com",
    "signupDate": "Jan 29, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Feb 20 \u00b7 22d after signup"
  },
  "pb-204": {
    "id": "pb-204",
    "title": "Rick Balys",
    "subtitle": null,
    "email": "rbalys@gmail.com",
    "signupDate": "Jan 29, 2026",
    "appointmentCount": 4,
    "bookingNote": "4 appts \u00b7 first: Jan 29 \u00b7 same day"
  },
  "pb-216": {
    "id": "pb-216",
    "title": "Evan",
    "subtitle": null,
    "email": "ehalliday87@gmail.com",
    "signupDate": "Jan 30, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Jan 31 \u00b7 1d after signup"
  },
  "pb-201": {
    "id": "pb-201",
    "title": "Mark B",
    "subtitle": null,
    "email": "mark4.barry4@gmail.com",
    "signupDate": "Jan 31, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Jan 31 \u00b7 same day"
  },
  "pb-222": {
    "id": "pb-222",
    "title": "Alwaleed Alshahir",
    "subtitle": null,
    "email": "alshahiralwaleed@gmail.com",
    "signupDate": "Feb 5, 2026",
    "appointmentCount": 4,
    "bookingNote": "4 appts \u00b7 first: Feb 7 \u00b7 2d after signup"
  },
  "pb-240": {
    "id": "pb-240",
    "title": "Bruce Lusby",
    "subtitle": null,
    "email": "bruce.lusby@premieremortgage.ca",
    "signupDate": "Feb 6, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Feb 11 \u00b7 5d after signup"
  },
  "pb-231": {
    "id": "pb-231",
    "title": "Tommy",
    "subtitle": null,
    "email": "tommysmail@gmx.com",
    "signupDate": "Feb 6, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Mar 6 \u00b7 28d after signup"
  },
  "pb-241": {
    "id": "pb-241",
    "title": "Peter Wong",
    "subtitle": null,
    "email": "pm@wongs.net.au",
    "signupDate": "Feb 6, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Feb 12 \u00b7 6d after signup"
  },
  "pb-224": {
    "id": "pb-224",
    "title": "Jed",
    "subtitle": null,
    "email": "jdouglas@currentstudios.ca",
    "signupDate": "Feb 10, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Feb 12 \u00b7 2d after signup"
  },
  "pb-225": {
    "id": "pb-225",
    "title": "Derek Gentile",
    "subtitle": null,
    "email": "gentilederek11@hotmail.com",
    "signupDate": "Feb 11, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 3 \u00b7 20d after signup"
  },
  "pb-266": {
    "id": "pb-266",
    "title": "Bruce G Keys",
    "subtitle": null,
    "email": "bkeys@eastlink.ca",
    "signupDate": "Feb 11, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-211": {
    "id": "pb-211",
    "title": "bruce keys",
    "subtitle": null,
    "email": "rq4wg5krns@privaterelay.appleid.com",
    "signupDate": "Feb 11, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Feb 11 \u00b7 same day"
  },
  "pb-208": {
    "id": "pb-208",
    "title": "Dr. Neil Smith",
    "subtitle": null,
    "email": "neilsmithmd@gmail.com",
    "signupDate": "Feb 13, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Feb 13 \u00b7 same day"
  },
  "pb-226": {
    "id": "pb-226",
    "title": "Tim Gillis",
    "subtitle": null,
    "email": "tcgillis@yahoo.ca",
    "signupDate": "Feb 13, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 5 \u00b7 20d after signup"
  },
  "pb-232": {
    "id": "pb-232",
    "title": "Peter Hickey",
    "subtitle": null,
    "email": "peterghickey@gmail.com",
    "signupDate": "Feb 14, 2026",
    "appointmentCount": 5,
    "bookingNote": "5 appts \u00b7 first: Feb 17 \u00b7 3d after signup"
  },
  "pb-202": {
    "id": "pb-202",
    "title": "Shawn Hirtle",
    "subtitle": null,
    "email": "hirtleshawn@gmail.com",
    "signupDate": "Feb 17, 2026",
    "appointmentCount": 3,
    "bookingNote": "3 appts \u00b7 first: Feb 17 \u00b7 same day"
  },
  "pb-206": {
    "id": "pb-206",
    "title": "Evan",
    "subtitle": null,
    "email": "evanrose12@gmail.com",
    "signupDate": "Feb 19, 2026",
    "appointmentCount": 3,
    "bookingNote": "3 appts \u00b7 first: Feb 19 \u00b7 same day"
  },
  "pb-209": {
    "id": "pb-209",
    "title": "Dan Weir",
    "subtitle": null,
    "email": "danhgweir@gmail.com",
    "signupDate": "Feb 19, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Feb 19 \u00b7 same day"
  },
  "pb-212": {
    "id": "pb-212",
    "title": "Mark Hewitt",
    "subtitle": null,
    "email": "mhewitt@dal.ca",
    "signupDate": "Feb 20, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Feb 21 \u00b7 1d after signup"
  },
  "pb-229": {
    "id": "pb-229",
    "title": "Paul Banks",
    "subtitle": null,
    "email": "pbanks2101@gmail.com",
    "signupDate": "Feb 21, 2026",
    "appointmentCount": 4,
    "bookingNote": "4 appts \u00b7 first: Mar 17 \u00b7 24d after signup"
  },
  "pb-264": {
    "id": "pb-264",
    "title": "Fred Wien",
    "subtitle": null,
    "email": "frederic.wien@dal.ca",
    "signupDate": "Feb 28, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-234": {
    "id": "pb-234",
    "title": "Derek Martin",
    "subtitle": null,
    "email": "derek.martin@hfxwanderersfc.ca",
    "signupDate": "Feb 28, 2026",
    "appointmentCount": 3,
    "bookingNote": "3 appts \u00b7 first: Mar 3 \u00b7 3d after signup"
  },
  "pb-217": {
    "id": "pb-217",
    "title": "Mike Evans",
    "subtitle": null,
    "email": "mikeevans98@hotmail.com",
    "signupDate": "Mar 4, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 5 \u00b7 1d after signup"
  },
  "pb-200": {
    "id": "pb-200",
    "title": "Kabi Thana",
    "subtitle": null,
    "email": "kabithana@gmail.com",
    "signupDate": "Mar 6, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 6 \u00b7 same day"
  },
  "pb-237": {
    "id": "pb-237",
    "title": "Lane Braidwood",
    "subtitle": null,
    "email": "lanebraidwood15@gmail.com",
    "signupDate": "Mar 6, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 10 \u00b7 4d after signup"
  },
  "pb-236": {
    "id": "pb-236",
    "title": "Hamed Hanafi",
    "subtitle": null,
    "email": "hamed.hanafi@gmail.com",
    "signupDate": "Mar 6, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 10 \u00b7 4d after signup"
  },
  "pb-213": {
    "id": "pb-213",
    "title": "Andrew Foote",
    "subtitle": null,
    "email": "andrewfoote10@hotmail.com",
    "signupDate": "Mar 6, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 7 \u00b7 1d after signup"
  },
  "pb-261": {
    "id": "pb-261",
    "title": "Peter zablocki",
    "subtitle": null,
    "email": "peterzablocki@hotmail.com",
    "signupDate": "Mar 7, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-238": {
    "id": "pb-238",
    "title": "David Regan",
    "subtitle": null,
    "email": "david.regan@insead.edu",
    "signupDate": "Mar 9, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Mar 13 \u00b7 4d after signup"
  },
  "pb-230": {
    "id": "pb-230",
    "title": "Paul Ryan",
    "subtitle": null,
    "email": "pryan2112@gmail.com",
    "signupDate": "Mar 9, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Apr 2 \u00b7 24d after signup"
  },
  "pb-267": {
    "id": "pb-267",
    "title": "Travis McDonough",
    "subtitle": null,
    "email": "travis.mcdonough@wellnify.ai",
    "signupDate": "Mar 9, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-221": {
    "id": "pb-221",
    "title": "Aaron Trask",
    "subtitle": null,
    "email": "aaronstrask1973@gmail.com",
    "signupDate": "Mar 9, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 28 \u00b7 19d after signup"
  },
  "pb-219": {
    "id": "pb-219",
    "title": "Mike Coldwell",
    "subtitle": null,
    "email": "michael.coldwell@dal.ca",
    "signupDate": "Mar 10, 2026",
    "appointmentCount": 4,
    "bookingNote": "4 appts \u00b7 first: Mar 20 \u00b7 10d after signup"
  },
  "pb-263": {
    "id": "pb-263",
    "title": "Jennifer",
    "subtitle": null,
    "email": "jenn.backman@gmail.com",
    "signupDate": "Mar 10, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-220": {
    "id": "pb-220",
    "title": "Ashoke Mohanraj",
    "subtitle": null,
    "email": "ashokemohanraj@hotmail.com",
    "signupDate": "Mar 12, 2026",
    "appointmentCount": 4,
    "bookingNote": "4 appts \u00b7 first: Mar 24 \u00b7 12d after signup"
  },
  "pb-218": {
    "id": "pb-218",
    "title": "Filippe Garcia Heringer",
    "subtitle": null,
    "email": "fgheringer@gmail.com",
    "signupDate": "Mar 12, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 13 \u00b7 1d after signup"
  },
  "pb-262": {
    "id": "pb-262",
    "title": "Michael Mailman",
    "subtitle": null,
    "email": "m.mailman@bluecharm.io",
    "signupDate": "Mar 12, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-248": {
    "id": "pb-248",
    "title": "Michael Mailman",
    "subtitle": null,
    "email": "mmailman@allumiqs.com",
    "signupDate": "Mar 12, 2026",
    "appointmentCount": 0,
    "bookingNote": null
  },
  "pb-268": {
    "id": "pb-268",
    "title": "Sho",
    "subtitle": null,
    "email": "shobadger@gmail.com",
    "signupDate": "Mar 13, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 13 \u00b7 same day"
  },
  "pb-269": {
    "id": "pb-269",
    "title": "Kevin Robert",
    "subtitle": null,
    "email": "kevin@tmgharbourtown.ca",
    "signupDate": "Mar 16, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Mar 19 \u00b7 3d after signup"
  },
  "pb-270": {
    "id": "pb-270",
    "title": "Fraser Hannah",
    "subtitle": null,
    "email": "fhannah94@live.co.uk",
    "signupDate": "Mar 16, 2026",
    "appointmentCount": 4,
    "bookingNote": "4 appts \u00b7 first: Mar 19 \u00b7 3d after signup"
  },
  "pb-271": {
    "id": "pb-271",
    "title": "Andrew MacGillivray",
    "subtitle": null,
    "email": "andrewsmacgillivray@gmail.com",
    "signupDate": "Mar 17, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 20 \u00b7 3d after signup"
  },
  "pb-272": {
    "id": "pb-272",
    "title": "Frederic Perron-Welch",
    "subtitle": null,
    "email": "frederic.perron.welch@dal.ca",
    "signupDate": "Mar 17, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 17 \u00b7 same day"
  },
  "pb-273": {
    "id": "pb-273",
    "title": "Yash Patel",
    "subtitle": null,
    "email": "patelyash2630@gmail.com",
    "signupDate": "Mar 20, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 26 \u00b7 6d after signup"
  },
  "pb-242": {
    "id": "pb-242",
    "title": "Shahin Tabrizi",
    "subtitle": null,
    "email": "shahin@tabrizi.com",
    "signupDate": "Mar 23, 2026",
    "appointmentCount": 2,
    "bookingNote": "2 appts \u00b7 first: Feb 19 \u00b7 32d before signup"
  },
  "pb-274": {
    "id": "pb-274",
    "title": "Brett Sawlor",
    "subtitle": null,
    "email": "brettsawlor@sawlor.com",
    "signupDate": "Mar 24, 2026",
    "appointmentCount": 1,
    "bookingNote": "Appt: Mar 26 \u00b7 2d after signup"
  }
};

const defaultColumns = [
  {
    "id": "col-b2-1",
    "title": "Did Not Finish Sign Up",
    "cardIds": [
      "pb-249",
      "pb-250",
      "pb-251",
      "pb-252",
      "pb-253",
      "pb-254",
      "pb-255",
      "pb-256",
      "pb-257",
      "pb-258",
      "pb-259",
      "pb-260"
    ]
  },
  {
    "id": "col-b2-2",
    "title": "Signed Up \u00b7 No Appointment",
    "cardIds": [
      "pb-265",
      "pb-266",
      "pb-264",
      "pb-261",
      "pb-267",
      "pb-263",
      "pb-262",
      "pb-248"
    ]
  },
  {
    "id": "col-b2-3",
    "title": "First Appointment Completed",
    "cardIds": [
      "pb-234",
      "pb-217",
      "pb-200",
      "pb-237",
      "pb-236",
      "pb-213",
      "pb-238",
      "pb-230",
      "pb-221",
      "pb-219",
      "pb-220",
      "pb-218",
      "pb-268",
      "pb-269",
      "pb-270",
      "pb-271",
      "pb-272",
      "pb-273",
      "pb-242",
      "pb-274"
    ]
  },
  {
    "id": "col-b2-4",
    "title": "Member for a Month",
    "cardIds": [
      "pb-215",
      "pb-214",
      "pb-210",
      "pb-239",
      "pb-207",
      "pb-233",
      "pb-203",
      "pb-235",
      "pb-244",
      "pb-243",
      "pb-245",
      "pb-223",
      "pb-205",
      "pb-228",
      "pb-246",
      "pb-227",
      "pb-204",
      "pb-216",
      "pb-201",
      "pb-222",
      "pb-240",
      "pb-231",
      "pb-241",
      "pb-224",
      "pb-225",
      "pb-211",
      "pb-208",
      "pb-226",
      "pb-232",
      "pb-202",
      "pb-206",
      "pb-209",
      "pb-212",
      "pb-229"
    ]
  }
];

function buildDefault() {
  return { columns: defaultColumns, cards: defaultCards };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.columns && parsed.cards) return parsed;
    }
  } catch {}
  return buildDefault();
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let nextId = Date.now();
function genId(prefix) {
  return `${prefix}-${nextId++}`;
}

export function useProperBarberBoard() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const { columns, cards } = state;

  const update = useCallback((updater) => {
    setState((prev) => updater(prev));
  }, []);

  const addCard = useCallback((columnId, title) => {
    const id = genId("card");
    update((d) => ({
      columns: d.columns.map((col) =>
        col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
      ),
      cards: { ...d.cards, [id]: { id, title, color: null, dueDate: null } },
    }));
  }, [update]);

  const deleteCard = useCallback((cardId) => {
    update((d) => {
      const newCards = { ...d.cards };
      delete newCards[cardId];
      return {
        columns: d.columns.map((col) => ({
          ...col,
          cardIds: col.cardIds.filter((id) => id !== cardId),
        })),
        cards: newCards,
      };
    });
  }, [update]);

  const updateCardTitle = useCallback((cardId, title) => {
    update((d) => ({
      ...d,
      cards: { ...d.cards, [cardId]: { ...d.cards[cardId], title } },
    }));
  }, [update]);

  const updateCardColor = useCallback((cardId, color) => {
    update((d) => ({
      ...d,
      cards: { ...d.cards, [cardId]: { ...d.cards[cardId], color } },
    }));
  }, [update]);

  const updateCardDueDate = useCallback((cardId, dueDate) => {
    update((d) => ({
      ...d,
      cards: { ...d.cards, [cardId]: { ...d.cards[cardId], dueDate } },
    }));
  }, [update]);

  const addColumn = useCallback((title) => {
    const id = genId("col");
    update((d) => ({
      ...d,
      columns: [...d.columns, { id, title, cardIds: [] }],
    }));
  }, [update]);

  const deleteColumn = useCallback((columnId) => {
    update((d) => ({
      ...d,
      columns: d.columns.filter((col) => col.id !== columnId),
    }));
  }, [update]);

  const updateColumnTitle = useCallback((columnId, title) => {
    update((d) => ({
      ...d,
      columns: d.columns.map((col) => (col.id === columnId ? { ...col, title } : col)),
    }));
  }, [update]);

  const moveCard = useCallback((activeId, overId, activeCol, overCol, overIndex) => {
    update((d) => {
      const next = d.columns.map((col) => ({ ...col, cardIds: [...col.cardIds] }));
      const srcCol = next.find((c) => c.id === activeCol);
      const dstCol = next.find((c) => c.id === overCol);
      if (!srcCol || !dstCol) return d;

      const srcIdx = srcCol.cardIds.indexOf(activeId);
      if (srcIdx === -1) return d;

      srcCol.cardIds.splice(srcIdx, 1);
      const insertIdx = overIndex !== undefined ? overIndex : dstCol.cardIds.length;
      dstCol.cardIds.splice(insertIdx, 0, activeId);

      return { ...d, columns: next };
    });
  }, [update]);

  return {
    columns,
    cards,
    addCard,
    deleteCard,
    updateCardTitle,
    updateCardColor,
    updateCardDueDate,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    moveCard,
  };
}
