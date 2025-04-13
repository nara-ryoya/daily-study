'use client'

import { ReactNode } from 'react'
import { Container, Typography, Box, AppBar, Toolbar } from '@mui/material'
import Link from 'next/link'

interface SimpleLayoutProps {
  title: string
  children: ReactNode
}

export const SimpleLayout = ({ title, children }: SimpleLayoutProps) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              Asuni
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {children}
        </Box>
      </Container>
    </>
  )
}
