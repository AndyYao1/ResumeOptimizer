def parsePrompt(text: str) -> str:
    return f"""
        Extract structured resume data into JSON.

        Return ONLY valid JSON with no additional text with this schema:
        {{
        "name": "",
        "email": "",
        "phone": "",
        "location": "",
        "skills": {{}},
        "experience": [
            {{
            "company": "",
            "role": "",
            "dates": "",
            "bullets": []
            }}
        ],
        "projects": [
            {{
            "name": "",
            "bullets": []
            }}
        ],
        "education": [
            {{
            "school": "",
            "degree": "",
            "gpa": "",
            "dates": ""
            }}
        ]
        }}

        Skills MUST be grouped into categories like:
        - Programming
        - Databases
        - Frameworks
        - Tools

        Example:
        "skills": {{
        "Programming": ["Python", "C++"],
        "Databases": ["MySQL", "MongoDB"]
        }}

        Resume:
        {text}
        """

def generatePrompt(bullets, job_description):
    return f"""
        You are an expert technical resume writer specializing in ATS-optimized software engineering resumes. 
        Rewrite the provided bullet points to align with the job description while preserving factual accuracy.

        Return ONLY valid JSON.

        Do not include markdown.
        Do not include explanations.
        Do not include code fences.
        Do not add additional sections.

        The response MUST follow this exact schema:

        {{
            "bullets": ["string"]
        }}

        Rules:
        - Each bullet must begin with a strong action verb
        - Each bullet must be one sentence
        - Maximum 30 words per bullet
        - Preserve technologies already present
        - Emphasize impact and measurable outcomes
        - Do not invent experience
        - Do not use first person pronouns 

        Job description:
        {job_description}

        Bullets:
        {bullets}
        """

def reorderSkillsPrompt(skills, job_description):
    return f"""
        Given a list of categories and skills, reorder the skills for each category in order of relevance

        Return ONLY valid JSON in the same format with no additional text 

        Job Description:
        {job_description}

        Skills:
        {skills}
        """