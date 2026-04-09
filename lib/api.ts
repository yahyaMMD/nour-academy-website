export const handleApiError = (error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }
    console.error('An unknown error occurred');
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  };
  

  type post_data = {
    title: string,
    description:string
  }


  export const validatePostData = (data : post_data) => {
    if (!data.title || typeof data.title !== 'string') {
      throw new Error('Title is required and must be a string');
    }
    if (!data.description || typeof data.description !== 'string') {
      throw new Error('Description is required and must be a string');
    }
  };