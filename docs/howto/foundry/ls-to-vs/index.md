# Converting LotusScript to VoltScript

This section will cover some tips on converting code.

!!! note
    This how-tos is not intended to give a 1:1 example of LotusScript and VoltScript. It is intended to educate, to help you understand the paradigms that may have become instinctive with Notes Client development, and to help you understand how code should be structured differently for development outside the Notes Client.

## Sample code

LotusScript code often combines UI and backend classes. This is an example of an action button used in read mode to change company name and update associated Contacts:

``` voltscript linenums="1"
Sub Click(Source As Button)
	Dim ws As New NotesUIWorkspace
	Dim companyName As String
	Dim newCompanyName As Variant
	Dim s As New NotesSession
	Dim doc As NotesDocument
	Dim contDoc As NotesDocument
	Dim db As NotesDatabase
	Dim view As NotesView
	Dim dc As NotesDocumentCollection
	
	Set doc = ws.CurrentDocument.Document
	companyName = doc.Company(0)
	newCompanyName =  ws.Prompt(PROMPT_OKCANCELEDIT, "New Company", "Enter New Company Name", companyName)
	If Not IsEmpty(newCompanyName) Then
		doc.Company = newCompanyName
		Call doc.Save(True, False, True)
		Print "Updated Company"
		Set db = s.CurrentDatabase
		Set view = db.GetView("(luContactsByCompany)")
		Set dc = view.GetAllDocumentsByKey(companyName, True)	
		Set contDoc = dc.GetFirstDocument
		While Not contDoc Is Nothing
			doc.Company = newCompanyName
			Call doc.save(True, False, True)
			Set contDoc = dc.GetNextDocument(contDoc)
		Wend
		Print "Updated " & dc.count & " contacts"
		Call ws.ViewRefresh
		Call ws.CurrentDocument.Close
		Call ws.EditDocument(False, doc)
	End If
End Sub
```

There are three aspects of converting this to VoltScript.

1. UI vs backend.
1. Notes backend classes.
1. Looping to update documents.

Let's break this out.

### UI vs back-end

This challenge is not specific to Volt MX Go or VoltScript. The same problem exists when converting this paradigm to XPages, or traditional Domino web development with Forms and Agents, or any web development platform where front-end and back-end code are separate.

The code falls into three sections:

1. Lines 12-16: gathering user input.
1. Lines 17-18, 20-28: backend processing.
1. Lines 19 and 29-32: UI updates.

Obviously, only the second section is relevant, whether it's XPages Java, a LotusScript web agent, or a VoltScript function in Volt Foundry. The first and third sections need to be processed in the web application's user interface.

This is the code that needs to be converted to VoltScript. There are variables used within these lines but defined outside these needs. The values need to be gathered in the UI and passed as inputs. Note that the `if` statement is not included in this part. With proper application development, the function should not be called if the company name is blank.

Note also that the `Print` statements are covered as UI updates. But it's important to state that there is no explicit success / failure processing: with everything being in synchronous LotusScript, if the database updates fail the code will error and the engine automatically notify the UI. The code will need to return success / failure explicitly in a format the UI can process. In the case of VoltScript on Volt Foundry, this is as a JSON, values in `VoltMXResult.result`.

### Notes backend classes

There is no concept of "current database" or "current document" in VoltScript. This contextual information needs to be passed as inputs, along with current user. **DrapiVSE** provides the classes to interact with Domino databases.

### Looping to update documents

Lines 27-34 get a `NotesDocumentCollection` and iterate each document in turn to update the company name. When converting code to run anywhere outside the current Domino server, looping paradigms should raise red flags. Regular calls to a remote server will perform badly. In LotusScript, this could and should be replaced with `NotesDocumentCollection.stampAll()`. In VoltScript, it should be replaced with a "/bulk/update" call to DRAPI, which can be achieved via `DrapiRequest.bulkPatchDocuments()`.

## Summary

Due to the fundamental differences in how VoltScript is used vs LotusScript, it requires you to have a different approach to how you write your code. VoltScript is independent of Domino; Domino is simply another back end available via REST APIs. So when working with a Domino back end, you need to approach it as you would working with any other back-end with a REST API. This means that you want to minimize your interactions with the API, because each round-trip to the server costs time. You also need to keep in mind that VoltScript is stateless, meaning each interaction with a REST API is independent of any previous or future actions.

Understanding these fundamental differences will allow you to write more efficient code to accomplish your goals.

!!! warning
    As with other languages, Domino access is based on Domino REST API. VoltScript does not provide full developer-level LotusScript-level access to the Domino server and database. Such code should be restricted to the Domino server, where it can be managed by the Domino Administrator. As a result, not all processes will be suitable for moving to VoltScript in a middleware layer.