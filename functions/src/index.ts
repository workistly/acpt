const { defineSecret } = require("firebase-functions/params");
const mail = require("@sendgrid/mail");
const { logger } = require("firebase-functions/v1");
const { onRequest } = require("firebase-functions/v2/https");
const { getAuth } = require("firebase-admin/auth");
const cors = require("cors")({ origin: true });
import { onSchedule } from "firebase-functions/v2/scheduler";
const Stripe = require("stripe");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");
const SENDGRID_EMAIL_USER_REGISTER = defineSecret(
  "SENDGRID_EMAIL_USER_REGISTER"
);
const STRIPE_API_KEY = defineSecret("STRIPE_API_KEY");
import { Request, Response } from "express";

exports.updateUser = onRequest(async (request: any, response: any) => {
  cors(request, response, async () => {
    const {
      uid,
      email,
      firstName,
      lastName,
      password,
      closePage,
      attemptedExams,
      userId,
    } = request.body;
    try {
      if (closePage) {
        await db.collection("users").doc(userId).set(
          {
            attempted_exams: attemptedExams,
          },
          { merge: true }
        );
        return response.json({ status: true });
      } else {
        let resp;
        if (password) {
          resp = await getAuth().updateUser(uid, {
            displayName: `${firstName} ${lastName}`,
            email,
            password,
          });
        } else {
          resp = await getAuth().updateUser(uid, {
            displayName: `${firstName} ${lastName}`,
            email,
          });
        }

        if (resp.uid) {
          await db.collection("users").doc(resp.uid).set(
            {
              firstName: firstName,
              lastName: lastName,
              email: resp.email,
            },
            { merge: true }
          );
        }
      }
      return response.json({ status: true });
    } catch (error) {
      return response.json({ status: false, message: error });
    }
  });
});

export const resetAttemptedExams = onSchedule(
  { schedule: "0 0 * * *" },
  async () => {
    const batch = db.batch();

    const querySnapshot = await db.collection("users").get();
    querySnapshot.forEach(function (doc: any) {
      batch.update(doc.ref, { attempted_exams: 0 });
    });
    await batch.commit();
  }
);

export const checkAccountExists = onRequest(
  async (request: any, response: any) => {
    cors(request, response, async () => {
      const { email } = request.body;
      const usersRef = db.collection("users");
      try {
        const querySnapshot = await usersRef.where("email", "==", email).get();
        if (querySnapshot.docs.length > 0) {
          return response.json({ status: true, exists: true });
        } else {
          return response.json({ status: true, exists: false });
        }
      } catch (error) {
        return response.json({ status: false, exists: false });
      }
    });
  }
);

const convertTimestampToDate = (timestamp: any) => {
  const milliseconds = timestamp * 1000;
  const dateObject = new Date(milliseconds);
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();
  return `${year}/${month}/${day}`;
};

const convertExamsDate = (timestamp: any) => {
  let date = new Date(Number(timestamp));
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${year}/${month}/${day}`;
};

export const setRegistrationsAnalytics = onSchedule(
  { schedule: "50 23 * * *" },
  async () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1; 
    let year = date.getFullYear();
    let currentDate = `${year}/${month}/${day}`;

    const collectionRef = db.collection("users");
    const snapshot = await collectionRef.get();
    const documents: any = [];

    snapshot.forEach((doc: any) => {
      documents.push(doc.data());
    });

    let totalRegUsers = 0;

    for (let i = 0; i < documents.length; i++) {
      const data = documents[i];
      const regDate =
        data && data.createdAt && data.createdAt.seconds
          ? convertTimestampToDate(data.createdAt.seconds)
          : "";

      if (currentDate && regDate && currentDate == regDate) {
        totalRegUsers = totalRegUsers + 1;
      }
    }

    let dataToStore = {
      date: currentDate,
      counts: totalRegUsers,
    };

    if (dataToStore) {
      // Add the document to the collection
      const collectionRef = db.collection("analytics_registrations");
      await collectionRef.add(dataToStore);
    }
  }
);

export const updateRegistrationsAnalytics = onRequest(
  async (request: any, response: any) => {
    cors(request, response, async () => {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${year}/${month}/${day}`;

      try {
        const collectionRef = db.collection("users");
        const snapshot = await collectionRef.get();
        const documents: any = [];

        snapshot.forEach((doc: any) => {
          documents.push(doc.data());
        });

        let totalRegUsers = 0;

        for (let i = 0; i < documents.length; i++) {
          const data = documents[i];
          const regDate =
            data && data.createdAt && data.createdAt.seconds
              ? convertTimestampToDate(data.createdAt.seconds)
              : "";

          if (currentDate && regDate && currentDate == regDate) {
            totalRegUsers = totalRegUsers + 1;
          }
        }

        let dataToStore = {
          date: currentDate,
          counts: totalRegUsers,
        };

        if (dataToStore) {
          // Add the document to the collection
          const docExist = await db
            .collection("analytics_registrations")
            .where("date", "==", currentDate)
            .get();
          if (docExist.docs.length > 0) {
            const docRef = db
              .collection("analytics_registrations")
              .doc(docExist.docs[0].id);
            await docRef.update(dataToStore);
          } else {
            const collectionRef = db.collection("analytics_registrations");
            await collectionRef.add(dataToStore);
          }
        }
        return response.json({ status: true });
      } catch (error) {
        return response.json({ status: false });
      }
    });
  }
);

export const updateExamsAnalytics = onRequest(
  async (request: any, response: any) => {
    cors(request, response, async () => {
      try {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1; 
        let year = date.getFullYear();
        let currentDate = `${year}/${month}/${day}`;

        const collectionRef = db.collection("exams_completed");
        const usersRef = db.collection("users");
        const snapshot = await collectionRef.get();
        const userSnapshot = await usersRef.get();
        const documents: any = [];
        const userDocuments: any = [];

        snapshot.forEach((doc: any) => {
          documents.push(doc.data());
        });

        userSnapshot.forEach((doc: any) => {
          userDocuments.push(doc.data());
        });

        let totalRegExams = 0;
        let emailSentExams = 0;
        let emailNotSentExams = 0;
        let completedRegExams = 0;
        let completedAndPaid = 0;
        let completedAndUnpaid = 0;
        let incompleteAndPaid = 0;
        let incompleteAndUnpaid = 0;
        let incompleteRegExams = 0;
        let paidRegExams = 0;
        let unpaidRegExams = 0;

        for (let i = 0; i < documents.length; i++) {
          const data = documents[i];
          const user: any = userDocuments.find(
            (item: any) => item.docId === data.user_id
          );

          const regDate =
            data && data.completed_at && data.completed_at !== ""
              ? convertExamsDate(data.completed_at)
              : "";

          if (currentDate && regDate && currentDate == regDate) {
            totalRegExams = totalRegExams + 1;

            if (user && user.email_sent) {
              emailSentExams = emailSentExams + 1;
            } else {
              emailNotSentExams = emailNotSentExams + 1;
            }

            if (
              data.status &&
              data.status.toString().toLowerCase() === "complete"
            ) {
              completedRegExams = completedRegExams + 1;
            } else {
              incompleteRegExams = incompleteRegExams + 1;
            }

            if (
              data.payment &&
              data.payment.toString().toLowerCase() === "paid"
            ) {
              paidRegExams = paidRegExams + 1;
            } else {
              unpaidRegExams = unpaidRegExams + 1;
            }

            if (data.payment && data.status) {
              if (
                data.payment.toString().toLowerCase() === "paid" &&
                data.status.toString().toLowerCase() === "complete"
              ) {
                completedAndPaid = completedAndPaid + 1;
              } else if (
                data.payment.toString().toLowerCase() === "paid" &&
                data.status.toString().toLowerCase() !== "complete"
              ) {
                incompleteAndPaid = incompleteAndPaid + 1;
              } else if (
                data.payment.toString().toLowerCase() !== "paid" &&
                data.status.toString().toLowerCase() === "complete"
              ) {
                completedAndUnpaid = completedAndUnpaid + 1;
              } else if (
                data.payment.toString().toLowerCase() !== "paid" &&
                data.status.toString().toLowerCase() !== "complete"
              ) {
                incompleteAndUnpaid = incompleteAndUnpaid + 1;
              }
            }
          }
        }

        let dataToStore = {
          date: currentDate,
          counts: totalRegExams,
          completed: completedRegExams,
          incomplete: incompleteRegExams,
          paid: paidRegExams,
          unpaid: unpaidRegExams,
          completedAndPaid: completedAndPaid,
          completedAndUnpaid: completedAndUnpaid,
          incompleteAndPaid: incompleteAndPaid,
          incompleteAndUnpaid: incompleteAndUnpaid,
        };

        if (dataToStore) {
          const docExist = await db
            .collection("analytics_exams")
            .where("date", "==", currentDate)
            .get();

          if (docExist.docs.length > 0) {
            const docRef = db
              .collection("analytics_exams")
              .doc(docExist.docs[0].id);
            await docRef.update(dataToStore);
          } else {
            const collectionRef = db.collection("analytics_exams");
            await collectionRef.add(dataToStore);
          }
        }

        return response.json({ status: true });
      } catch (error) {
        return response.json({ status: false });
      }
    });
  }
);

export const setExamsAnalytics = onSchedule(
  { schedule: "50 23 * * *" },
  async () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}/${month}/${day}`;

    const collectionRef = db.collection("exams_completed");
    const snapshot = await collectionRef.get();
    const documents: any = [];

    snapshot.forEach((doc: any) => {
      documents.push(doc.data());
    });

    let totalRegExams = 0;
    let completedRegExams = 0;
    let completedAndPaid = 0;
    let completedAndUnpaid = 0;
    let incompleteAndPaid = 0;
    let incompleteAndUnpaid = 0;
    let incompleteRegExams = 0;
    let paidRegExams = 0;
    let unpaidRegExams = 0;

    for (let i = 0; i < documents.length; i++) {
      const data = documents[i];
      const regDate =
        data && data.completed_at && data.completed_at !== ""
          ? convertExamsDate(data.completed_at)
          : "";

      if (currentDate && regDate && currentDate == regDate) {
        totalRegExams = totalRegExams + 1;
        if (
          data.status &&
          data.status.toString().toLowerCase() === "complete"
        ) {
          completedRegExams = completedRegExams + 1;
        } else {
          incompleteRegExams = incompleteRegExams + 1;
        }

        if (data.payment && data.payment.toString().toLowerCase() === "paid") {
          paidRegExams = paidRegExams + 1;
        } else {
          unpaidRegExams = unpaidRegExams + 1;
        }

        if (data.payment && data.status) {
          if (
            data.payment.toString().toLowerCase() === "paid" &&
            data.status.toString().toLowerCase() === "complete"
          ) {
            completedAndPaid = completedAndPaid + 1;
          } else if (
            data.payment.toString().toLowerCase() === "paid" &&
            data.status.toString().toLowerCase() !== "complete"
          ) {
            incompleteAndPaid = incompleteAndPaid + 1;
          } else if (
            data.payment.toString().toLowerCase() !== "paid" &&
            data.status.toString().toLowerCase() === "complete"
          ) {
            completedAndUnpaid = completedAndUnpaid + 1;
          } else if (
            data.payment.toString().toLowerCase() !== "paid" &&
            data.status.toString().toLowerCase() !== "complete"
          ) {
            incompleteAndUnpaid = incompleteAndUnpaid + 1;
          }
        }
      }
    }

    let dataToStore = {
      date: currentDate,
      counts: totalRegExams,
      completed: completedRegExams,
      incomplete: incompleteRegExams,
      paid: paidRegExams,
      unpaid: unpaidRegExams,
      completedAndPaid: completedAndPaid,
      completedAndUnpaid: completedAndUnpaid,
      incompleteAndPaid: incompleteAndPaid,
      incompleteAndUnpaid: incompleteAndUnpaid,
    };

    if (dataToStore) {
      // Add the document to the collection
      const collectionRef = db.collection("analytics_exams");
      await collectionRef.add(dataToStore);
    }
  }
);

exports.sendFrontEndMail = onRequest(
  {
    secrets: [SENDGRID_API_KEY, SENDGRID_EMAIL_USER_REGISTER],
  },
  async (request: any, response: any) => {
    cors(request, response, async () => {
      mail.setApiKey(SENDGRID_API_KEY.value());
      const { emails } = request.body;
      logger.log(emails);
      // Handle Template ID & Data
      const templateID = SENDGRID_EMAIL_USER_REGISTER.value();
      const emailsArray = emails.split(",");

      const templateData = {
        first_name: "Test",
        last_name: "Test",
      };

      const mailData = {
        to: emailsArray,
        from: "admin@lacmal.com",
        templateId: templateID,
        dynamicTemplateData: templateData,
      };

      return await mail
        .send(mailData)
        .then(async () => {
          const emailsDoc = await db
            .collection("users")
            .where("email", "in", emails.split(","))
            .get();
          const batch = db.batch();
          emailsDoc.forEach((doc: any) => {
            logger.log(doc);
            batch.update(doc.ref, { email_sent: true });
          });
          await batch.commit();
          return response.json({ status: true });
        })
        .catch((error: any) => {
          return response.json({ status: false });
        });
    });
  }
);

exports.getCertificateData = onRequest(async (request: any, response: any) => {
  cors(request, response, async () => {
    const { certificate_number } = request.body;
    try {
      const querySnapshot = await db
        .collection("certificates")
        .where("certificateNumber", "==", Number(certificate_number))
        .get();

      const docsArr: any = [];
      let expired = false;
      querySnapshot.forEach((doc: any) => {
        const docData = doc.data();
        if (docData.paid) {
          if (
            docData.expiryDateTime &&
            new Date(docData.expiryDateTime) < new Date()
          ) {
            expired = true;
          } else {
            docsArr.push({
              userName: docData.userName,
              certificateNumber: docData.certificateNumber,
              score: docData.score,
              docId: doc.id,
              imageUrl: docData.imageUrl,
            });
          }
        }
      });
      if (docsArr.length > 0 || expired) {
        return response.json({
          status: true,
          data: docsArr.length > 0 ? docsArr[0] : null,
          expired,
        });
      } else {
        return response.json({ status: false });
      }
    } catch (error) {
      logger.log("error", error);
      return response.json({ status: false });
    }
  });
});

exports.getCertificateDataById = onRequest(
  async (request: any, response: any) => {
    cors(request, response, async () => {
      const { docId } = request.body;
      try {
        const doc = await db.collection("certificates").doc(docId).get();
        if (doc.exists) {
          let expired = false;
          let docObj: any = null;
          const docData = doc.data();
          if (docData.paid) {
            if (
              docData.expiryDateTime &&
              new Date(docData.expiryDateTime) < new Date()
            ) {
              expired = true;
            } else {
              docObj = {
                userName: docData.userName,
                certificateNumber: docData.certificateNumber,
                score: docData.score,
                imageUrl: docData.imageUrl,
              };
            }
          } else {
            return response.json({ status: false });
          }

          if (docObj || expired) {
            return response.json({
              status: true,
              data: docObj ? docObj : null,
              expired,
            });
          }
        } else {
          return response.json({ status: false });
        }
      } catch (error) {
        logger.log("error", error);
        return response.json({ status: false });
      }
    });
  }
);

exports.processPayment = onRequest(
  {
    secrets: [STRIPE_API_KEY],
  },
  async (request: any, response: any) => {
    cors(request, response, async () => {
      const { amount, currency } = request.body;
      const stripe = new Stripe(STRIPE_API_KEY.value(), {
        typescript: true,
      });

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Number(amount) * 100,
          currency,
        });
        return response.json({
          status: true,
          paymentIntent: paymentIntent.client_secret,
        });
      } catch (error) {
        return response.json({ status: false, error });
      }
    });
  }
);

exports.refundPayment = onRequest(
  {
    secrets: [STRIPE_API_KEY],
  },
  async (request: any, response: any) => {
    cors(request, response, async () => {
      const { paymentIntent } = request.body;
      const stripe = new Stripe(STRIPE_API_KEY.value(), {
        typescript: true,
      });
      try {
        const refund = await stripe.refunds.create({
          payment_intent: paymentIntent,
        });
        return response.json({ status: true, refund });
      } catch (error) {
        return response.json({ status: false, error });
      }
    });
  }
);

exports.addIncompleteExam = onRequest(async (request: any, response: any) => {
  cors(request, response, async () => {
    const { user_id, examId, language, examsAttempted, examsCompleted } =
      JSON.parse(request.body);
    try {
      const batch = db.batch();
      const docRef = db.collection("exams_completed").doc();
      batch.set(
        docRef,
        {
          score: 0,
          user_id: user_id,
          completed_at: new Date().getTime(),
          status: "Incomplete",
          payment: "Unpaid",
          language,
          examId,
        },
        {
          merge: true,
        }
      );

      batch.set(
        db.collection("users").doc(user_id),
        {
          attempted_exams: examsAttempted ? examsAttempted + 1 : 1,
          completed_exams: examsCompleted ? examsCompleted + 1 : 1,
        },
        { merge: true }
      );

      await batch.commit();
      return response.json({
        status: true,
      });
    } catch (error) {
      logger.log(error);
      return response.json({
        status: false,
      });
    }
  });
});

exports.verifyCertificate = onRequest(
  { secrets: [SENDGRID_API_KEY] },
  async (request: Request, response: Response) => {
    // Handle CORS
    cors(request, response, async () => {
      logger.info("Received a request to verify a certificate");

      const { certificateNumber, firstName, lastName } = request.body;

      if (request.method !== "POST") {
        logger.warn("Invalid HTTP method used. Only POST is allowed.");
        return response.status(405).json({ error: "Method Not Allowed" });
      }

      // Log input values for debugging
      if (!certificateNumber || !firstName || !lastName) {
        logger.error(
          `Missing required parameters. Received: certificateNumber=${certificateNumber}, firstName=${firstName}, lastName=${lastName}`
        );
        return response.status(400).json({ error: "Missing required fields" });
      }

      try {
        const userName = `${firstName} ${lastName}`;
        const currentTimestamp = Date.now();

        // Log the query parameters
        logger.info(
          `Querying certificates collection with certificateNumber=${certificateNumber}, userName=${userName}, expiryDateTime greater than ${currentTimestamp}`
        );

        // Query the "certificates" collection
        const querySnapshot = await db
          .collection("certificates")
          .where("certificateNumber", "==", Number(certificateNumber))
          .where("userName", "==", userName)
          .where("expiryDateTime", ">", currentTimestamp)
          .get();

        if (querySnapshot.empty) {
          logger.info(
            `No matching certificates found for certificateNumber=${certificateNumber}, userName=${userName}, expiryDateTime greater than ${currentTimestamp}`
          );
          return response.json({ status: false });
        }

        // Log success if a matching certificate exists
        logger.info(
          `Certificate verified successfully for certificateNumber=${certificateNumber}, userName=${userName}`
        );
        return response.json({ status: true });
      } catch (error: unknown) {
        // Type guard to check if error has a 'message' property
        if (error instanceof Error) {
          logger.error("Error verifying certificate:", error);
          return response.status(500).json({
            status: false,
            error: "Internal Server Error",
            message: error.message,
          });
        }

        // Handle generic unknown errors
        logger.error("An unknown error occurred:", error);
        return response.status(500).json({
          status: false,
          error: "Internal Server Error",
          message: "Unknown error occurred",
        });
      }
    });
  }
);
