import useChangeLanguage from '@/hooks/useChangeLanguage'
import { LANGUAGES } from '@/utils/const'
import { ActionIcon, Menu } from '@mantine/core'
import { IconWorld } from '@tabler/icons-react'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  className?: string
}

const LanguageSelectorMobile: FC<Props> = ({ className }) => {
  const changeLanguage = useChangeLanguage()

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="outline" size="xl" color="dark" className={clsx('border-gray-300', className)}>
          <IconWorld />
        </ActionIcon>
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

export default LanguageSelectorMobile
