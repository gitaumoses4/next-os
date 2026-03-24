'use client'

import { useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Switch,
  Select,
  SelectItem,
  Button,
  Avatar,
  Divider,
  Tab,
  Tabs,
} from '@heroui/react'
import {
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlinePaintBrush,
} from 'react-icons/hi2'

export default function Settings() {
  const [name, setName] = useState('Moses Gitau')
  const [email, setEmail] = useState('moses@example.com')
  const [role, setRole] = useState('admin')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="min-h-screen bg-default-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-default-500">Manage your account and preferences</p>
      </div>

      <Tabs variant="underlined" classNames={{ tabList: 'mb-6' }}>
        <Tab
          key="profile"
          title={
            <div className="flex items-center gap-1.5">
              <HiOutlineUser className="h-4 w-4" />
              <span>Profile</span>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <Card className="border border-divider shadow-sm">
              <CardBody className="gap-6 p-6">
                <div className="flex items-center gap-4">
                  <Avatar name="MG" size="lg" className="bg-primary text-white" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Profile Photo</p>
                    <div className="mt-1.5 flex gap-2">
                      <Button size="sm" variant="bordered">
                        Change
                      </Button>
                      <Button size="sm" variant="light" color="danger">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    value={name}
                    onValueChange={setName}
                    variant="bordered"
                    size="sm"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onValueChange={setEmail}
                    variant="bordered"
                    size="sm"
                  />
                  <Select
                    label="Role"
                    selectedKeys={[role]}
                    onSelectionChange={(keys) => setRole(Array.from(keys)[0] as string)}
                    variant="bordered"
                    size="sm"
                  >
                    <SelectItem key="admin">Admin</SelectItem>
                    <SelectItem key="editor">Editor</SelectItem>
                    <SelectItem key="viewer">Viewer</SelectItem>
                  </Select>
                  <Select
                    label="Timezone"
                    defaultSelectedKeys={['eat']}
                    variant="bordered"
                    size="sm"
                  >
                    <SelectItem key="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem key="est">Eastern Time (EST)</SelectItem>
                    <SelectItem key="utc">UTC</SelectItem>
                    <SelectItem key="eat">East Africa Time (EAT)</SelectItem>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button color="primary" size="sm">
                    Save changes
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab
          key="notifications"
          title={
            <div className="flex items-center gap-1.5">
              <HiOutlineBell className="h-4 w-4" />
              <span>Notifications</span>
            </div>
          }
        >
          <Card className="border border-divider shadow-sm">
            <CardBody className="gap-0 p-0">
              {[
                {
                  label: 'Email notifications',
                  desc: 'Receive updates about activity in your workspace',
                  checked: emailNotifs,
                  onChange: setEmailNotifs,
                },
                {
                  label: 'Push notifications',
                  desc: 'Get notified in your browser for important events',
                  checked: pushNotifs,
                  onChange: setPushNotifs,
                },
                {
                  label: 'Weekly digest',
                  desc: 'Summary of workspace activity sent every Monday',
                  checked: weeklyDigest,
                  onChange: setWeeklyDigest,
                },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-default-500">{item.desc}</p>
                    </div>
                    <Switch size="sm" isSelected={item.checked} onValueChange={item.onChange} />
                  </div>
                  {i < 2 && <Divider />}
                </div>
              ))}
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="security"
          title={
            <div className="flex items-center gap-1.5">
              <HiOutlineShieldCheck className="h-4 w-4" />
              <span>Security</span>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <Card className="border border-divider shadow-sm">
              <CardHeader className="flex-col items-start px-6 pb-0 pt-5">
                <h3 className="text-sm font-semibold text-foreground">Password</h3>
              </CardHeader>
              <CardBody className="gap-4 px-6 pb-6">
                <Input label="Current password" type="password" variant="bordered" size="sm" />
                <Input label="New password" type="password" variant="bordered" size="sm" />
                <Input label="Confirm new password" type="password" variant="bordered" size="sm" />
                <div className="flex justify-end">
                  <Button color="primary" size="sm">
                    Update password
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card className="border border-divider shadow-sm">
              <CardBody className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                    <p className="text-xs text-default-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch size="sm" isSelected={twoFactor} onValueChange={setTwoFactor} />
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab
          key="appearance"
          title={
            <div className="flex items-center gap-1.5">
              <HiOutlinePaintBrush className="h-4 w-4" />
              <span>Appearance</span>
            </div>
          }
        >
          <Card className="border border-divider shadow-sm">
            <CardBody className="gap-4 p-6">
              <Select label="Theme" defaultSelectedKeys={['system']} variant="bordered" size="sm">
                <SelectItem key="light">Light</SelectItem>
                <SelectItem key="dark">Dark</SelectItem>
                <SelectItem key="system">System</SelectItem>
              </Select>
              <Select
                label="Font size"
                defaultSelectedKeys={['medium']}
                variant="bordered"
                size="sm"
              >
                <SelectItem key="small">Small</SelectItem>
                <SelectItem key="medium">Medium</SelectItem>
                <SelectItem key="large">Large</SelectItem>
              </Select>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  )
}
