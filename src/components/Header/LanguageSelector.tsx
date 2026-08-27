import useChangeLanguage from '@/hooks/useChangeLanguage'
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/utils/const'
import { Button, Menu } from '@mantine/core'
import { IconChevronDown, IconWorld } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface Props {
  className?: string
}

const LanguageSelector: FC<Props> = ({ className }) => {
  const router = useRouter()
  const changeLanguage = useChangeLanguage()

  return (
    <Menu>
      <Menu.Target>
        <Button
          fw={400}
          leftSection={<IconWorld size={18} />}
          rightSection={<IconChevronDown size={18} />}
          className={className}
        >
          {LANGUAGES.find((el) => el.value === (router.locale || DEFAULT_LANGUAGE))?.label}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {LANGUAGES.map((el) => (
          <Menu.Item key={el.value} onClick={() => changeLanguage(el.value)}>
            {el.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

export default LanguageSelector
