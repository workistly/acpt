import { getAllDocs } from '@/api/doc'
import AdminLayout from '@/components/Layout/AdminLayout'
import AppHead from '@/components/Layout/AppHead'
import PageLoader from '@/components/Loader/PageLoader'
import PageTitle from '@/components/Title/PageTitle'
import { useUser } from '@/contexts/UserProvider'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import ModalAddQuestion from '@/modules/admin/question/ModalAddQuestion'
import QuestionItem from '@/modules/admin/question/QuestionItem'
import { Question } from '@/types/question'
import { LANGUAGE_OPTIONS } from '@/utils/const'
import { useLingui } from '@lingui/react/macro'
import { Accordion, Button, Group, Modal, Select, Stack, Switch, Text, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { FC, useEffect, useMemo, useState } from 'react'

interface Props {}

const QuestionsPage: FC<Props> = () => {
  useLoginRedirect()
  const { t } = useLingui()
  const { fetching } = useUser()
  const [showAdd, showAddHandlers] = useDisclosure(false)

  const [loading, setLoading] = useState(true)
  const [filterLanguage, setFilterLanguage] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [questionLanguageMap, setQuestionLanguageMap] = useState<any>({})
  const [archivedQuestions, setArchivedQuestions] = useState<Question[]>([])
  const [questions, setQuestions] = useState<Question[]>([])

  const getQuestions = async () => {
    const resp = await getAllDocs('exams_questions')
    if (resp.status && resp.fullData.length > 0) {
      const obj: any = {}
      const arr: any = []
      const arr2: any = []
      resp.fullData.forEach((question: any) => {
        obj[question.language] = obj[question.language] ? [...obj[question.language], question] : [question]

        if (!question.is_archived) {
          arr.push(question)
        } else {
          arr2.push(question)
        }
      })
      setQuestionLanguageMap(obj)
      setArchivedQuestions(arr2)
      setQuestions(arr)
    }

    setLoading(false)
  }

  useEffect(() => {
    getQuestions()
  }, [])

  const filteredQuestions = useMemo(() => {
    let filteredQuestions = showArchived ? archivedQuestions : questions

    if (filterLanguage) {
      filteredQuestions = []
      const arr: any = []
      if (questionLanguageMap[filterLanguage || '']) {
        if (showArchived) {
          questionLanguageMap[filterLanguage || ''].forEach((question: any) => {
            if (question.is_archived) {
              arr.push(question)
            }
          })
        } else {
          questionLanguageMap[filterLanguage || ''].forEach((question: any) => {
            if (!question.is_archived) {
              arr.push(question)
            }
          })
        }

        filteredQuestions = arr
      }
    }

    if (searchVal) {
      filteredQuestions = filteredQuestions.filter((question: any) =>
        question.question.toLowerCase().includes(searchVal.toLowerCase()),
      )
    }

    return filteredQuestions
  }, [archivedQuestions, filterLanguage, questionLanguageMap, questions, searchVal, showArchived])

  if (fetching) return <PageLoader />

  return (
    <AdminLayout>
      <AppHead title="Question Bank" />

      <Stack className="gap-xl">
        <PageTitle>Question Bank</PageTitle>

        <Group>
          <Switch label="Show Archived" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />

          <Button leftSection={<IconPlus size={18} />} className="ml-auto" onClick={showAddHandlers.open}>
            Add a new question
          </Button>

          <Modal opened={showAdd} onClose={showAddHandlers.close} title="Add a new question" size="xl">
            <ModalAddQuestion
              questionLanguageMap={questionLanguageMap}
              onClose={showAddHandlers.close}
              onSuccess={getQuestions}
            />
          </Modal>
        </Group>

        <Group>
          <TextInput
            placeholder="Search by Name, Email, Certificate No."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            leftSection={<IconSearch />}
            w={500}
            maw="100%"
            className="mr-auto"
          />

          <Select
            clearable
            data={LANGUAGE_OPTIONS}
            placeholder="Language"
            value={filterLanguage}
            onChange={setFilterLanguage}
          />
        </Group>

        <Group mih={30}>
          <Group gap={4}>
            <Text>
              Total: <strong>{filteredQuestions.length}</strong> Questions
            </Text>
          </Group>
        </Group>

        {loading && <PageLoader />}

        <Accordion variant="separated" radius="md" multiple>
          {filteredQuestions.map((el) => (
            <QuestionItem key={el.docId} data={el} onSuccess={getQuestions} />
          ))}
        </Accordion>
      </Stack>
    </AdminLayout>
  )
}

export default QuestionsPage
