import { TypographyStylesProvider } from '@mantine/core'
import { FC } from 'react'

interface Props {}

const CookieEnglish: FC<Props> = () => {
  return (
    <TypographyStylesProvider>
      <h2>1. Website Usage and Consent</h2>
      <p>
        By accessing and using this site you consent to the ACPT Privacy Policy without limitation or qualification.
      </p>
      <p>
        The ACPT Privacy Policy applies solely to information collected by us and may differ from the policies of other
        companies&apos; or organizations&apos; websites that you link to from this website. We recommend that you read
        the privacy policy of any other companies&apos; or organizations&apos; website that you link to from our
        website.
      </p>

      <h2>2. Use of Cookies</h2>
      <p>
        Please be aware that we use cookies on our website. We use cookies to track the interests of our users so that
        we can subsequently enhance their experience on our website. If your browser rejects a cookie, you may still use
        our website.
      </p>
      <p>
        Our website uses cookies to distinguish you from other users of our website without storing any personally
        identifiable information about you. This helps us to provide you with a good experience when you browse our
        website and also allows us to improve our site. A cookie is a small file of letters and numbers that we store on
        your browser or the hard drive of your computer. Cookies contain information that is transferred to your
        computer&apos;s hard drive.
      </p>

      <h2>3. Cookies Used on This Website</h2>

      <p>
        We use essential cookies which are those used for processes such as check-out and shopping baskets, and
        non-essential cookies are used for analytical purposes like counting the traffic on the site.
      </p>
      <p>
        Most of the cookies that we use are &apos;analytical&apos; cookies. They allow us to recognize and count the
        number of visitors and to see how visitors move around the site when they are using it. This helps us to improve
        the way our website works, for example, by ensuring that users are finding what they are looking for easily.
        None of our cookies store any personal information such as your name or address.
      </p>

      <h2>4. Cookies Set Up by Sharing Tools</h2>
      <p>
        We would like to draw your attention to the fact that many of our websites now carry embedded &apos;share&apos;
        buttons to enable users of the site to easily share articles with their friends through a number of popular
        social networks. These sites may set a cookie when you are also logged in to their service. The ACPT does not
        control the dissemination of these cookies and you should check the relevant third-party website for more
        information about these.
      </p>

      <h2>5. Turning Off Cookies</h2>
      <p>
        You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or
        some cookies. If you use your browser settings to block all cookies (including essential cookies) you may not be
        able to access all or parts of our site or any other websites that you visit.
      </p>
    </TypographyStylesProvider>
  )
}

export default CookieEnglish
