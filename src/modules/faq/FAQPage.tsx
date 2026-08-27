import TabButton from '@/components/Button/TabButton'
import PublicSidebarLayout from '@/components/Layout/PublicSidebarLayout'
import FAQItem from '@/modules/faq/FAQItem'
import { useLingui } from '@lingui/react/macro'
import { Group, ScrollArea, Stack, UnstyledButton } from '@mantine/core'
import clsx from 'clsx'
import { FC, useMemo, useState } from 'react'

interface Props {}

const FAQPage: FC<Props> = () => {
  const { t } = useLingui()
  const [tab, setTab] = useState(0)

  const ITEMS = useMemo(
    () => [
      {
        title: t`General`,
        items: [
          {
            question: t`What is the ACPT?`,
            answer: t`The Advanced Certified Professional Tutor (ACPT) exam is a globally recognized exam that evaluates tutors' subject knowledge, teaching ability, and professional skills through a computer-adaptive test.`,
          },
          {
            question: t`What is a computer-adaptive test?`,
            answer: t`A computer-adaptive test adjusts the difficulty of questions based on your answers in real time for a more precise evaluation.`,
          },
          {
            question: t`What topics are covered in the exam?`,
            answer: t`The ACPT covers K–12 subject knowledge, effective teaching strategies, instructional best practices, and practical tutoring scenarios that test your communication skills, adaptability, and problem-solving abilities.`,
          },
          {
            question: t`Who recognizes the ACPT certification?`,
            answer: t`The ACPT is recognized globally by academic institutions, tutoring companies, freelance platforms, government agencies, and professional associations.`,
          },
          {
            question: t`How do I verify someone's ACPT certification?`,
            answer: t`You can verify a certification by using the "Verify a Certificate" tool on the ACPT website or by accessing the unique certificate URL provided to the test taker.`,
          },
        ],
      },
      {
        title: t`Registration`,
        items: [
          {
            question: t`How much does the exam cost?`,
            answer: t`The ACPT is entirely free, and you can retake the exam once per day at no charge.`,
          },
          {
            question: t`Where can I take the exam?`,
            answer: t`The ACPT is now delivered exclusively online. The written version is no longer available. This shift allows for faster results, stronger security, and a more accessible experience for all test takers.`,
          },
          {
            question: t`When can I take the exam?`,
            answer: t`The platform is accessible 24/7, except during scheduled maintenance periods. You can take the exam at any time. No appointment is needed.`,
          },
          {
            question: t`How do I register an account?`,
            answer: t`Click the "Register" button, fill in your details, and verify your email.`,
          },
          {
            question: t`Can I update my profile information?`,
            answer: t`Yes, you can update your profile information at any time through the settings menu.`,
          },
          {
            question: t`What happens if I forget my password?`,
            answer: t`Use the "Forgot Password" link on the login page to reset your password via email.`,
          },
        ],
      },
      {
        title: t`Before the exam`,
        items: [
          {
            question: t`How many questions are on the exam?`,
            answer: t`The ACPT consists of 50 multiple-choice questions.`,
          },
          {
            question: t`How do I prepare for the exam?`,
            answer: t`You can request the free ACPT Study Guide and practice with the sample questions included.`,
          },
          {
            question: t`What technical requirements are there?`,
            answer: t`A stable internet connection, an updated browser (such as Chrome, Firefox, or Safari), and any internet-connected device.`,
          },
          {
            question: t`Can I take the ACPT on a tablet or smartphone?`,
            answer: t`Yes, as long as your device has a supported browser and a stable internet connection.`,
          },
          {
            question: t`What browsers are supported?`,
            answer: t`Most modern browsers are supported, including Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge. Make sure your browser is up to date for the best experience.`,
          },
          {
            question: t`Is the ACPT accessible for test takers with disabilities?`,
            answer: t`Yes, you can request accommodations by contacting support before starting the exam. All requests are handled confidentially.`,
          },
          {
            question: t`What languages is the exam available in?`,
            answer: t`Currently, the ACPT is available in English and Turkish, with additional languages planned for future release.`,
          },
          {
            question: t`Is the ACPT valid in my country?`,
            answer: t`Yes, the ACPT is globally recognized and accepted across all regions and education systems. However, some organizations may require you to take the exam in your native language, so it's best to check their specific requirements.`,
          },
        ],
      },
      {
        title: t`During the exam`,
        items: [
          {
            question: t`Does the ACPT have a time limit?`,
            answer: t`Yes, the ACPT has a 40-minute time limit. A timer is displayed during the exam, but you can hide it if you find it distracting.`,
          },
          {
            question: t`Can I pause the exam after starting it?`,
            answer: t`No. Once you begin the ACPT, it must be completed in one uninterrupted 40-minute session. If the session is interrupted, your progress will be lost.`,
          },
          {
            question: t`What happens if I lose internet connection during the test?`,
            answer: t`If you lose your internet connection or close the browser, the session will end and your progress will be lost. You will need to retake the exam.`,
          },
          {
            question: t`Will unanswered or incomplete questions affect my score?`,
            answer: t`Yes, unanswered or incomplete questions are marked as incorrect. It's important to answer all questions within the time limit.`,
          },
          {
            question: t`Can I use notes or a calculator during the ACPT?`,
            answer: t`No. The use of notes, devices, or assistance from others is strictly prohibited.`,
          },
        ],
      },
      {
        title: t`After the exam`,
        items: [
          {
            question: t`How is the ACPT scored?`,
            answer: t`You will receive a score between 0 and 100 immediately after completing the exam. A score of 75 or higher is considered passing.`,
          },
          {
            question: t`When will I get my results?`,
            answer: t`You will receive your results immediately after finishing the exam.`,
          },
          {
            question: t`What if I fail the ACPT?`,
            answer: t`You can retake the exam once per day.`,
          },
          {
            question: t`What happens if I pass the ACPT?`,
            answer: t`You will have the option to obtain a certificate, or save your score in your profile.`,
          },
          {
            question: t`How often can I take the exam?`,
            answer: t`You can take the ACPT twice every 24 hours, regardless if you pass or fail. This allows you to improve your score or simply try again if you're not satisfied with your performance.`,
          },
          {
            question: t`Will my scores be saved?`,
            answer: t`Yes, your scores are automatically stored in your profile. You'll have the option to choose which score you want to share with others.`,
          },
        ],
      },
      {
        title: t`Certificates`,
        items: [
          {
            question: t`How can I show that I passed the ACPT?`,
            answer: t`Once you pass the ACPT, you'll have the option to obtain an official certificate that you can download, share digitally, or present to employers, clients, or institutions as proof of your achievement.`,
          },
          {
            question: t`How can I share my certificate?`,
            answer: t`You can share your personalized URL, which links directly to your live certificate page; download a PDF version for printing or sending as an attachment; or share your certificate ID number, which can be verified through the ACPT website.`,
          },
          {
            question: t`Does ACPT certification expire?`,
            answer: t`Yes, ACPT certification is valid for two years. After that, you'll need to retake the exam to maintain your certified status and ensure your skills remain up to date.`,
          },
          {
            question: t`Can others verify my certificate?`,
            answer: t`Yes, you can share your personalized URL, which links directly to your live certificate page, or share your unique certificate ID number. Anyone with this information can verify your certification on the ACPT website.`,
          },
          {
            question: t`Can I get a certificate for an old score?`,
            answer: t`Yes, you can obtain a certificate for any score earned within the past year. All exam results are stored in your profile for 12 months.`,
          },
        ],
      },
    ],
    [t],
  )

  return (
    <PublicSidebarLayout title={t`Frequently Asked Questions`}>
      <Stack mb={80}>
        <ScrollArea type="never" className="border-b-2 border-red-600">
          <Group className="gap-3 flex-nowrap">
            {ITEMS.map((el, index) => (
              <TabButton key={el.title} active={index === tab} onClick={() => setTab(index)}>
                {el.title}
              </TabButton>
            ))}
          </Group>
        </ScrollArea>

        {ITEMS.map((section, index) => (
          <Stack key={section.title} gap={0} className={clsx(index !== tab && 'hidden')}>
            {section.items.map((item, idx) => (
              <FAQItem key={idx} question={item.question} answer={item.answer} />
            ))}
          </Stack>
        ))}
      </Stack>
    </PublicSidebarLayout>
  )
}

export default FAQPage
