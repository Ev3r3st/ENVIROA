export const login = async (username: string, password: string): Promise<string> => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      throw new Error("Login failed");
    }
  
    return response.text(); // Vrací odpověď jako text
  };
  