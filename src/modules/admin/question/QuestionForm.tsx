import { QuestionPayload } from '@/types/question'
import { LANGUAGE_OPTIONS } from '@/utils/const'
import { Flex, Group, Radio, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { FC } from 'react'

interface Props {
  form: UseFormReturnType<QuestionPayload>
}

const QuestionForm: FC<Props> = ({ form }) => {
  return (
    <>
      <Group>
        <Select
          label="What language is this question?"
          data={LANGUAGE_OPTIONS}
          placeholder="Language"
          {...form.getInputProps('language')}
        />
      </Group>

      <Textarea autosize minRows={3} label="Question" {...form.getInputProps('question')} />

      <Radio.Group {...form.getInputProps('correctAnswer')}>
        <Stack>
          <Flex className="gap-4">
            <Radio value="answer1" className="mt-1" />

            <TextInput flex={1} label="Answer 1" {...form.getInputProps('answer1')} />
          </Flex>

          <Flex className="gap-4">
            <Radio value="answer2" className="mt-1" />

            <TextInput flex={1} label="Answer 2" {...form.getInputProps('answer2')} />
          </Flex>

          <Flex className="gap-4">
            <Radio value="answer3" className="mt-1" />

            <TextInput flex={1} label="Answer 3" {...form.getInputProps('answer3')} />
          </Flex>

          <Flex className="gap-4">
            <Radio value="answer4" className="mt-1" />

            <TextInput flex={1} label="Answer 4" {...form.getInputProps('answer4')} />
          </Flex>
        </Stack>
      </Radio.Group>
    </>
  )
}

export default QuestionForm
