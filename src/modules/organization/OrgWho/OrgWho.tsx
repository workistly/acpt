import BlockTitle from '@/components/Title/BlockTitle'
import { Trans, useLingui } from '@lingui/react/macro'
import { List, Stack, Text } from '@mantine/core'
import { FC, useMemo } from 'react'

interface Props {}

const OrgWho: FC<Props> = () => {
  const { t } = useLingui()

  const ITEMS = useMemo(
    () => [
      {
        title: t`Educational Institutions`,
        description: t`Universities, colleges, and schools that provide tutoring services.`,
      },
      {
        title: t`Tutoring Agencies & Platforms`,
        description: t`Organizations that hire online or in-house tutors, connect tutors with students, or operate tutoring marketplaces.`,
      },
      {
        title: t`EdTech Companies`,
        description: t`Organizations offering test prep services, educational apps, or other services that integrate human tutoring as part of the learning experience.`,
      },
      {
        title: t`Government Agencies`,
        description: t`Government regulators that require a standardized, evidence-based framework to promote accountability and establish consistent oversight across the academic tutoring industry.`,
      },
      {
        title: t`Professional & Industry Associations`,
        description: t`Organizations that uphold professional standards and formally recognize qualified tutors.`,
      },
    ],
    [t],
  )

  return (
    <Stack className="mb-20 sm:mb-30">
      <BlockTitle>
        <Trans>Who accepts the ACPT?</Trans>
      </BlockTitle>

      <Text fw={500} fs="italic">
        A wide range of organizations trust the ACPT to validate a tutor’s subject matter expertise, instructional
        skill, and professional readiness. By accepting the ACPT, organizations ensure they are working with individuals
        who have demonstrated a high level of competency and commitment. Institutions that accept the ACPT include:
      </Text>

      <List my={16} spacing="sm">
        {ITEMS.map((el) => (
          <List.Item key={el.title} className="list-triangle">
            <Text>
              <strong>{el.title}:</strong>
              <br /> {el.description}
            </Text>
          </List.Item>
        ))}
      </List>
    </Stack>
  )
}

export default OrgWho
