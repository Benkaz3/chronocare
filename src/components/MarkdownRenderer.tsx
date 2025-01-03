/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/MarkdownRenderer.tsx
// this file is currently NOT used. TO DO: Fix the file in the future.

// import React from 'react';
// import ReactMarkdown, { Components } from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import { Typography, Link as MuiLink } from '@mui/material';

// const components: Components = {
//   h1: ({ node, ...props }) => (
//     <Typography variant='h4' component='h1' gutterBottom {...props}>
//       {props.children}
//     </Typography>
//   ),
//   h2: ({ node, ...props }) => (
//     <Typography variant='h5' component='h2' gutterBottom {...props}>
//       {props.children}
//     </Typography>
//   ),
//   h3: ({ node, ...props }) => (
//     <Typography variant='h6' component='h3' gutterBottom {...props}>
//       {props.children}
//     </Typography>
//   ),
//   p: ({ node, ...props }) => (
//     <Typography variant='body1' paragraph component='p' {...props}>
//       {props.children}
//     </Typography>
//   ),
//   a: ({ node, href, ...props }) => (
//     <MuiLink href={href} component='a' {...props}>
//       {props.children}
//     </MuiLink>
//   ),
//   li: ({ node, ...props }) => (
//     <li>
//       <Typography component='span' variant='body1' {...props}>
//         {props.children}
//       </Typography>
//     </li>
//   ),
// };

// interface MarkdownRendererProps {
//   content: string;
// }

// const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
//   return (
//     <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
//       {content}
//     </ReactMarkdown>
//   );
// };

// export default MarkdownRenderer;
