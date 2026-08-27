import PageTitle from '@/components/Title/PageTitle'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Group, List, Stack, Table, Text } from '@mantine/core'
import Link from 'next/link'
import { FC, useMemo } from 'react'

interface Props {}

const LandingExam: FC<Props> = () => {
  const { t } = useLingui()

  const ITEMS = useMemo(
    () => [
      {
        title: t`Duration`,
        description: t`40 minutes`,
      },
      {
        title: t`Question Type`,
        description: t`50 multiple-choice questions`,
      },
      {
        title: t`Format`,
        description: t`100% online. No appointment required.`,
      },
      {
        title: t`Cost`,
        description: t`Free`,
      },
      {
        title: t`Exam Results`,
        description: t`Results are delivered immediately upon completion of exam`,
      },
      {
        title: t`Requirements`,
        description: t`You’ll need a stable internet connection, a supported browser, and an internet-connected device.`,
      },
      {
        title: t`Retakes`,
        description: t`You may retake the exam once per day`,
      },
      {
        title: t`Scoring`,
        description: t`The score range is 0–100. A passing score is 75`,
      },
      {
        title: t`Languages`,
        description: t`English, Turkish`,
      },
      {
        title: t`Accessibility`,
        description: t`Accommodations are available upon request`,
      },
      {
        title: t`Exam Content`,
        items: [
          t`Subject matter from core academic areas relevant to K–12 tutoring`,
          t`Effective teaching strategies, and instructional best practices`,
          t`Practical tutoring skills, including communication, adaptability, and real-world problem-solving in tutoring scenarios`,
        ],
      },
      {
        title: t`Policies`,
        items: [
          t`The use of notes, devices, or assistance from others is prohibited.`,
          t`Unanswered or incomplete questions are scored as incorrect.`,
          t`Progress will be lost if the exam session is interrupted or disconnected.`,
        ],
      },
    ],
    [t],
  )

  return (
    <Stack className="mb-20 sm:mb-30">
      <PageTitle order={2} className="text-left">
        <Trans>Exam Details</Trans>
      </PageTitle>

      <Stack gap={8} my={16} className="border-t-2 border-t-red-600">
        <Table withTableBorder>
          <Table.Tbody className="text-center">
            {ITEMS.map((el) => (
              <Table.Tr key={el.title}>
                <Table.Th className="p-4 bg-gray-50 text-center">
                  <Text>{el.title}</Text>
                </Table.Th>
                <Table.Td className="p-4 w-[600px]">
                  {el.description && <Text>{el.description}</Text>}

                  {el.items && (
                    <List type="ordered" className="text-left">
                      {el.items.map((item, index) => (
                        <List.Item key={index}>{item}</List.Item>
                      ))}
                    </List>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>

      <Group>
        <Button component={Link} href="/welcome" miw={200}>
          <Trans>Start The Exam</Trans>
        </Button>
      </Group>
    </Stack>
  )
}

export default LandingExam
